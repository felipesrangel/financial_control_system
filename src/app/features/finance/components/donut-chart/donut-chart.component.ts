import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartSegment, DonutChartUtility } from 'src/app/shared/utilities/donut-chart.utility';
import { CategoryExpense } from 'src/app/features/finance/models/category';
import { FinanceService } from 'src/app/features/finance/services/finance.service';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
  imports: [CommonModule]
})
export class DonutChartComponent implements OnInit {

  categories: CategoryExpense[] = [];
  chartSegments: ChartSegment[] = [];

  constructor(private financeService: FinanceService) {}

  ngOnInit() {
    this.categories = this.financeService.getCategoryExpenses();
    this.chartSegments = DonutChartUtility.buildChartSegments(this.categories);
  }
}
