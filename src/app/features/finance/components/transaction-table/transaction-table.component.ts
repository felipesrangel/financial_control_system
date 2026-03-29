import { Component, Input, OnInit } from '@angular/core';


import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TRANSACTION_MENU_ITEMS } from 'src/app/shared/constants/transaction-menu.constant';
import { EntityColorUtility } from 'src/app/shared/utilities/entity-color.utility';
import { PersonTransaction, Transaction } from 'src/app/features/finance/models/transaction';
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
  items: MenuItem[] = TRANSACTION_MENU_ITEMS;

  constructor(private financeService: FinanceService) {}

  ngOnInit() {
    if (this.transactions.length === 0) {
      this.transactions = this.financeService.getTransactions();
    }
  }

  getInitialsColor = EntityColorUtility.getInitialsColor;
  getIconBg = EntityColorUtility.getIconBg;
  getIconLabel = EntityColorUtility.getIconLabel;

  isPerson(tx: Transaction): tx is PersonTransaction {
    return tx.type === 'person';
  }
}
