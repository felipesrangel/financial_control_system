import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartSegment, DonutChartUtility } from 'src/app/shared/utilities/donut-chart.utility';
import { Category, CategoryExpense } from 'src/app/features/finance/models/category';
import { Transaction } from 'src/app/features/finance/models/transaction';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
  imports: [CommonModule]
})
export class DonutChartComponent implements OnChanges {

  @Input() categories: Category[] = [];
  @Input() transactions: Transaction[] = [];

  chartCategories: CategoryExpense[] = [];
  chartSegments: ChartSegment[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] || changes['transactions']) {
      this.buildChart();
    }
  }

  private buildChart(): void {
    const expenseCategories = this.categories.filter(category => category.type === 'expense');
    const valuesByCategory = new Map<number, number>();

    for (const transaction of this.transactions) {
      const category = expenseCategories.find(item => item.id === transaction.categoryId);

      if (!category) {
        continue;
      }

      const currentValue = valuesByCategory.get(transaction.categoryId) ?? 0;
      valuesByCategory.set(transaction.categoryId, currentValue + Math.abs(transaction.value));
    }

    const total = Array.from(valuesByCategory.values()).reduce((sum, value) => sum + value, 0);

    this.chartCategories = expenseCategories
      .filter(category => valuesByCategory.has(category.id))
      .map((category, index) => {
        const value = valuesByCategory.get(category.id) ?? 0;

        return {
          name: category.name,
          percentage: total > 0 ? (value / total) * 100 : 0,
          color: category.color ?? this.getDefaultColor(index),
          icon: category.icon ?? 'pi pi-tag'
        };
      });

    this.chartSegments = DonutChartUtility.buildChartSegments(this.chartCategories);
  }

  private getDefaultColor(index: number): string {
    const palette = ['#6366F1', '#EF4444', '#3B82F6', '#22C55E', '#A855F7', '#F59E0B', '#14B8A6'];
    return palette[index % palette.length];
  }
}
