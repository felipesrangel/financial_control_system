export interface Category {
  id: number;
  name: string;
  type: 'expense' | 'income';
  percentage?: number;
  color?: string;
  icon?: string;
}

export interface CategoryExpense {
  name: string;
  percentage: number;
  color: string;
  icon: string;
}
 