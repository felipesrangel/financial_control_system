import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';


import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { EntityColorUtility } from 'src/app/shared/utilities/entity-color.utility';
import { Transaction } from 'src/app/features/finance/models/transaction';
import { Category } from 'src/app/features/finance/models/category';
import { FinanceService } from 'src/app/features/finance/services/finance.service';
import { SharedNgModule } from 'src/app/shared/shared.module';


@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
  standalone: true,
  imports: [SharedNgModule, Menu, ButtonModule, MenuModule]
})
export class TransactionTableComponent implements OnInit {

  @Input() transactions: Transaction[] = [];
  @Output() editRequested = new EventEmitter<Transaction>();
  private financeService = inject(FinanceService);
  private readonly menuItemsCache = new Map<number, MenuItem[]>();
  private readonly merchantIconMap: Array<{ key: string; matches: string[] }> = [
    { key: 'netflix', matches: ['netflix'] },
    { key: 'spotify', matches: ['spotify'] },
    { key: 'amazon', matches: ['amazon'] },
    { key: 'shopify', matches: ['shopify'] },
  ];

  constructor() {}

  ngOnInit() {
  }

  getInitialsColor = EntityColorUtility.getInitialsColor;
  getIconBg = EntityColorUtility.getIconBg;
  getIconLabel = EntityColorUtility.getIconLabel;

  getCategory(categoryId: number): Category | undefined {
    return this.financeService.getCategoryById(categoryId);
  }

  getMerchantIconKey(transaction: Transaction): string | null {
    const description = transaction.description.toLowerCase();
    const merchant = this.merchantIconMap.find(item =>
      item.matches.some(match => description.includes(match))
    );

    return merchant?.key ?? null;
  }

  getTransactionAvatarBackground(transaction: Transaction): string {
    const merchantKey = this.getMerchantIconKey(transaction);

    if (merchantKey) {
      return this.getIconBg(merchantKey);
    }

    const category = this.getCategory(transaction.categoryId);
    return this.getInitialsColor(this.getTransactionInitials(transaction));
  }

  getTransactionAvatarLabel(transaction: Transaction): string {
    const merchantKey = this.getMerchantIconKey(transaction);

    if (merchantKey) {
      return this.getIconLabel(merchantKey);
    }

    return this.getTransactionInitials(transaction);
  }

  getTransactionInitials(transaction: Transaction): string {
    return transaction.description
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  getMenuItems(transactionId: number): MenuItem[] {
    const cachedItems = this.menuItemsCache.get(transactionId);

    if (cachedItems) {
      return cachedItems;
    }

    const menuItems: MenuItem[] = [
      {
        label: 'Options',
        items: [
          {
            label: 'Editar',
            icon: 'pi pi-pen-to-square',
            command: () => {
              const transaction = this.transactions.find(item => item.id === transactionId);

              if (transaction) {
                this.editRequested.emit(transaction);
              }
            }
          },
          {
            label: 'Excluir',
            icon: 'pi pi-trash',
            command: () => this.deleteTransaction(transactionId)
          }
        ]
      }
    ];

    this.menuItemsCache.set(transactionId, menuItems);
    return menuItems;
  }

  deleteTransaction(transactionId: number): void {
    this.financeService.deleteTransaction(transactionId).subscribe({
      next: () => {
        this.financeService.loadDashboard();
      }
    });
  }
  isExpense(categoryId: number): boolean {
    return this.getCategory(categoryId)?.type === 'expense';
  }

  getDisplayValue(transaction: Transaction): number {
    return Math.abs(transaction.value);
  }

  getPaymentMethodLabel(paymentMethod: Transaction['paymentMethod']): string {
    const labels: Record<Transaction['paymentMethod'], string> = {
      pix: 'Pix',
      creditCard: 'Credit Card',
      debitCard: 'Debit Card',
      cash: 'Cash'
    };

    return labels[paymentMethod];
  }
}
