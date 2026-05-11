import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/features/finance/components/navbar/navbar.component';
import { SummaryCardComponent } from 'src/app/features/finance/components/summary-card/summary-card.component';
import { ActionCardComponent } from 'src/app/features/finance/components/action-card/action-card.component';
import { DonutChartComponent } from 'src/app/features/finance/components/donut-chart/donut-chart.component';
import { TransactionTableComponent } from 'src/app/features/finance/components/transaction-table/transaction-table.component';
import { FinanceService } from 'src/app/features/finance/services/finance.service';
import { TranscationModalComponent } from 'src/app/features/finance/components/transcation-modal/transcation-modal.component';
import { TransactionType } from 'src/app/features/finance/models/transaction';
import { TransactionForm } from 'src/app/features/finance/models/transaction-form';
import { LaunchRequest } from 'src/app/features/finance/models/launch';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Transaction } from 'src/app/features/finance/models/transaction';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorState } from 'primeng/paginator';


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
    TranscationModalComponent,
    ProgressSpinner,
    PaginatorModule
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
  modalMode: 'create' | 'edit' = 'create';
  selectedLaunch: Transaction | null = null;

  private financeService = inject(FinanceService);

  readonly transactions = this.financeService.transactions;
  readonly allTransactions = this.financeService.allTransactions;
  readonly categories = this.financeService.categories;
  readonly summary = this.financeService.summary;
  readonly categoryExpenses = this.financeService.categoryExpenses;
  readonly loading = this.financeService.loading;
  readonly error = this.financeService.error;
  readonly balance = this.financeService.balance;
  readonly transactionsTotalCount = this.financeService.transactionsTotalCount;
  readonly transactionsPageNumber = this.financeService.transactionsPageNumber;
  readonly transactionsPageSize = this.financeService.transactionsPageSize;
  
  constructor() {}
 
  ngOnInit(): void {
    this.financeService.loadDashboard();
  }
 
  selectPeriod(period: Period): void {
    this.selectedPeriod = period;
  }

  onTransactionsPageChange(event: PaginatorState): void {
    const pageNumber = (event.page ?? 0) + 1;
    const pageSize = event.rows ?? this.transactionsPageSize();

    this.financeService.loadTransactionsPage(pageNumber, pageSize);
  }

  onActionClick(action: ActionType): void {
    if (action === 'income' || action === 'expense') {
      this.selectedLaunch = null;
      this.modalMode = 'create';
      this.modalType    = action;
      this.modalVisible = true;
    }
  }

  onEditRequested(launch: Transaction): void {
    this.selectedLaunch = launch;
    this.modalMode = 'edit';
    this.modalType = this.getLaunchType(launch);
    this.modalVisible = true;
  }
 
  /** Recebe o formulário validado do modal e adiciona à lista de transações */
  onTransactionSubmitted(data: TransactionForm & { type: TransactionType }): void {
    const now = new Date().toISOString();
    const isEdit = this.modalMode === 'edit' && this.selectedLaunch !== null;

    const newLaunch: LaunchRequest = {
      description: data.description,
      value: Math.abs(data.value ?? 0),
      launchDate: data.launchDate ? data.launchDate.toISOString() : now,
      categoryId: data.categoryId ?? 0,
      paymentMethod: data.paymentMethod || 'cash',
      createdAt: isEdit ? this.selectedLaunch!.createdAt : now,
      updatedAt: now
    };
 
    const request$ = isEdit
      ? this.financeService.updateLaunch(this.selectedLaunch!.id, newLaunch)
      : this.financeService.createLaunch(newLaunch);

    request$.subscribe({
      next: () => {
        this.selectedLaunch = null;
        this.modalMode = 'create';
        this.financeService.loadDashboard();
      }
    });
  }

  private getLaunchType(launch: Transaction): TransactionType {
    return this.financeService.getCategoryById(launch.categoryId)?.type ?? 'income';
  }
}
