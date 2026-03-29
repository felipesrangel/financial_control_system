import { Injectable } from '@angular/core';
import { SummaryCard } from '../models/summary-card';
import { Transaction } from '../models/transaction';
import { CategoryExpense } from '../models/category';

@Injectable({ providedIn: 'root' })
export class FinanceService {

  getSummary(): SummaryCard[] {
    return [
      { label: 'Balance',  value: 5502.45, change: 12.5  },
      { label: 'Incomes',  value: 9450.00, change: 27    },
      { label: 'Expenses', value: 3945.55, change: -15   },
    ];
  }

  getTransactions(): Transaction[] {
    return [
      { id: 1, type: 'person', initials: 'OR', description: 'Orlando Rodrigues', method: 'Bank account', date: '2024-04-01', amount:  750.00 },
      { id: 2, type: 'merchant', icon: 'netflix', description: 'Netflix', method: 'Credit card', date: '2024-03-29', amount: -9.90 },
      { id: 3, type: 'merchant', icon: 'spotify', description: 'Spotify', method: 'Credit card', date: '2024-03-29', amount: -19.90 },
      { id: 4, type: 'person', initials: 'CA', description: 'Carl Andrew', method: 'Bank account', date: '2024-03-27', amount: 400.00 },
      { id: 5, type: 'merchant', icon: 'carrefour', description: 'Carrefour Market', method: 'Credit card', date: '2024-03-26', amount: -64.33 },
    ];
  }

  getCategoryExpenses(): CategoryExpense[] {
    return [
      { name: 'House',          percentage: 41.35, color: '#6366F1', icon: 'pi pi-home'           },
      { name: 'Credit card',    percentage: 21.51, color: '#EF4444', icon: 'pi pi-credit-card'     },
      { name: 'Transportation', percentage: 13.47, color: '#3B82F6', icon: 'pi pi-car'             },
      { name: 'Groceries',      percentage:  9.97, color: '#22C55E', icon: 'pi pi-shopping-cart'   },
      { name: 'Shopping',       percentage:  3.35, color: '#A855F7', icon: 'pi pi-shopping-bag'    },
    ];
  }
}