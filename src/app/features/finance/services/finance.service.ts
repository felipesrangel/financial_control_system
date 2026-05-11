import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Balance } from 'src/app/features/finance/models/balance';
import { Category, CategoryExpense } from 'src/app/features/finance/models/category';
import { LaunchRequest, LaunchResponse } from 'src/app/features/finance/models/launch';
import { LaunchPaginationRequest, PagedResult } from 'src/app/features/finance/models/pagination';
import { SummaryCard } from 'src/app/features/finance/models/summary-card';
import { Transaction } from 'src/app/features/finance/models/transaction';
import { environment } from 'src/env/env';


@Injectable({ providedIn: 'root' })
export class FinanceService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  private readonly _message = signal('');
  readonly message = this._message.asReadonly();



  private readonly _summary = signal<SummaryCard[]>([]);
  private readonly _allTransactions = signal<Transaction[]>([]);
  private readonly _transactions = signal<Transaction[]>([]);
  private readonly _categories = signal<Category[]>([]);
  private readonly _categoryExpenses = signal<CategoryExpense[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _categoryMap = signal<Map<number, Category>>(new Map());
  private readonly _transactionsTotalCount = signal(0);
  private readonly _transactionsPageNumber = signal(1);
  private readonly _transactionsPageSize = signal(5);
  private readonly _transactionsTotalPages = signal(0);

  readonly summary = this._summary.asReadonly();
  readonly allTransactions = this._allTransactions.asReadonly();
  readonly transactions = this._transactions.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly categoryExpenses = this._categoryExpenses.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly transactionsTotalCount = this._transactionsTotalCount.asReadonly();
  readonly transactionsPageNumber = this._transactionsPageNumber.asReadonly();
  readonly transactionsPageSize = this._transactionsPageSize.asReadonly();
  readonly transactionsTotalPages = this._transactionsTotalPages.asReadonly();

  readonly balance = computed(() =>
    this._summary().find(item => item.label === 'Balance')?.value ?? 0
  );

  loadDashboard(): void {
    this._loading.set(true);
    this._error.set(null);

    const paginationRequest: LaunchPaginationRequest = {
      pageNumber: this._transactionsPageNumber(),
      pageSize: this._transactionsPageSize()
    };

    forkJoin({
      summary: this.http.get<Balance>(`${this.apiUrl}/Launch/balance`),
      allTransactions: this.http.get<Transaction[]>(`${this.apiUrl}/Launch`),
      transactionsPage: this.getPaginatedTransactions(paginationRequest),
      categories: this.http.get<Category[]>(`${this.apiUrl}/Category`)
    }).subscribe({
      next: ({ summary, allTransactions, transactionsPage, categories }) => {
        // Criar mapa de categorias para lookup rápido
        this._categoryMap.set(new Map(categories.map(c => [c.id, c])));
        
        this._summary.set(this.transformBalance(summary));
        this._allTransactions.set(allTransactions);
        this.applyTransactionPage(transactionsPage);
        this._categories.set(categories);
        this._categoryExpenses.set(this.transformCategoriesToExpenses(categories));
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Erro ao carregar dashboard.');
        this._loading.set(false);
      }
    });
  }

  addTransaction(transaction: Transaction): void {
    this._transactions.update(current => [transaction, ...current]);
  }

  loadTransactionsPage(pageNumber: number, pageSize: number = this._transactionsPageSize()): void {
    this._transactionsPageNumber.set(pageNumber);
    this._transactionsPageSize.set(pageSize);

    this.getPaginatedTransactions({ pageNumber, pageSize }).subscribe({
      next: (page) => {
        this.applyTransactionPage(page);
      },
      error: () => {
        this._error.set('Erro ao carregar lançamentos.');
      }
    });
  }

  createLaunch(request: LaunchRequest): Observable<LaunchResponse> {
    return this.http.post<LaunchResponse>(`${this.apiUrl}/Launch`, request);
  }

  updateLaunch(id: number, request: LaunchRequest): Observable<LaunchResponse> {
    return this.http.put<LaunchResponse>(`${this.apiUrl}/Launch/update/${id}`, request);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Launch/${id}`);
  }

  getCategoryById(id: number): Category | undefined {
    return this._categoryMap().get(id);
  }

  private transformBalance(balance: Balance): SummaryCard[] {
    return [
      { label: 'Balance', value: balance.balance, change: 0 },
      { label: 'Incomes', value: balance.totalIncome, change: 0 },
      { label: 'Expenses', value: balance.totalExpense, change: 0 }
    ];
  }

  private transformCategoriesToExpenses(categories: Category[]): CategoryExpense[] {
    return categories
      .filter(c => c.type === 'expense')
      .map(c => ({
        name: c.name,
        percentage: c.percentage || 0,
        color: c.color || '#6366F1',
        icon: c.icon || 'pi pi-tag'
      }));
  }

  private getPaginatedTransactions(request: LaunchPaginationRequest): Observable<PagedResult<Transaction>> {
    const params = this.buildPaginationParams(request);

    return this.http.get<PagedResult<Transaction>>(`${this.apiUrl}/Launch/paginated`, { params });
  }

  private applyTransactionPage(page: PagedResult<Transaction>): void {
    this._transactions.set(page.items);
    this._transactionsTotalCount.set(page.totalCount);
    this._transactionsPageNumber.set(page.pageNumber);
    this._transactionsPageSize.set(page.pageSize);
    this._transactionsTotalPages.set(page.totalPages);
  }

  private buildPaginationParams(request: LaunchPaginationRequest): HttpParams {
    let params = new HttpParams()
      .set('PageNumber', request.pageNumber)
      .set('PageSize', request.pageSize);

    if (request.startDate) {
      params = params.set('StartDate', request.startDate);
    }

    if (request.endDate) {
      params = params.set('EndDate', request.endDate);
    }

    return params;
  }
}