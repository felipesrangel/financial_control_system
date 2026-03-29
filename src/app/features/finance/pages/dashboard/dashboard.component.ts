import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/features/finance/components/navbar/navbar.component';
import { SummaryCardComponent } from 'src/app/features/finance/components/summary-card/summary-card.component';
import { ActionCardComponent } from 'src/app/features/finance/components/action-card/action-card.component';
import { DonutChartComponent } from 'src/app/features/finance/components/donut-chart/donut-chart.component';
import { TransactionTableComponent } from 'src/app/features/finance/components/transaction-table/transaction-table.component';
import { FinanceService } from 'src/app/features/finance/services/finance.service';
import { TranscationModalComponent } from 'src/app/features/finance/components/transcation-modal/transcation-modal.component';
import { Transaction, TransactionType } from 'src/app/features/finance/models/transaction';
import { TransactionForm } from 'src/app/features/finance/models/transaction-form';


type Period = 'thisMonth' | 'lastMonth' | 'thisYear' | 'last12Months';
type ActionType = 'income' | 'expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    NavbarComponent, 
    SummaryCardComponent, 
    ActionCardComponent,
    DonutChartComponent,
    TransactionTableComponent,
    TranscationModalComponent
  ]
})
export class DashboardComponent implements OnInit {

  selectedPeriod: Period = 'thisMonth';
  periods: { key: Period; label: string }[] = [
    { key: 'thisMonth',    label: 'This month'     },
    { key: 'lastMonth',    label: 'Last month'     },
    { key: 'thisYear',     label: 'This year'      },
    { key: 'last12Months',label: 'Last 12 months' },
  ];

  modalVisible    = false;
  modalType: TransactionType = 'income';
  transactions: Transaction[] = [];
  
  constructor(private financeService: FinanceService) {}
 
  ngOnInit(): void {
    this.transactions = this.financeService.getTransactions();
  }
 
  selectPeriod(period: Period): void {
    this.selectedPeriod = period;
  }

  onActionClick(action: ActionType): void {
    if (action === 'income' || action === 'expense') {
      this.modalType    = action;
      this.modalVisible = true;
    }
  }
 
  /** Recebe o formulário validado do modal e adiciona à lista de transações */
  onTransactionSubmitted(data: TransactionForm & { type: TransactionType }): void {
    const newTransaction: Transaction = {
      id:          Date.now(),
      type:        'person',
      description: data.description,
      method:      data.method as Transaction['method'],
      date:        data.date ? data.date.toISOString().split('T')[0] : '',
      amount:      data.type === 'expense' ? -Math.abs(data.amount!) : Math.abs(data.amount!),
      initials:    data.description.slice(0, 2).toUpperCase(),
    };
 
    // Adiciona no topo da lista
    this.transactions = [newTransaction, ...this.transactions];
  }
}
