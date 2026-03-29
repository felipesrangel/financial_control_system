import { CategoryExpense } from "src/app/features/finance/models/category";


export interface ChartSegment {
  offset: number;
  dash: number;
  color: string;
}

export class DonutChartUtility {
  static readonly CIRCUMFERENCE = 2 * Math.PI * 60;

  static buildChartSegments(categories: CategoryExpense[]): ChartSegment[] {
    const total = this.CIRCUMFERENCE;
    let cumulative = 0;
    return categories.map(cat => {
      const dash = (cat.percentage / 100) * total;
      const offset = total - cumulative;
      cumulative += dash;
      return { offset, dash, color: cat.color };
    });
  }
}