import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule }       from 'primeng/dialog';
import { ButtonModule }       from 'primeng/button';
import { InputTextModule }    from 'primeng/inputtext';
import { InputNumberModule }  from 'primeng/inputnumber';
import { CalendarModule }     from 'primeng/calendar';
import { DropdownModule }     from 'primeng/dropdown';
import { DividerModule }      from 'primeng/divider';
import { TransactionForm } from 'src/app/features/finance/models/transaction-form';
import { TransactionType } from 'src/app/features/finance/models/transaction';

@Component({
  selector: 'app-transcation-modal',
  standalone: true,
  templateUrl: './transcation-modal.component.html',
  styleUrls: ['./transcation-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    DividerModule,
  ]
})
export class TranscationModalComponent implements OnChanges  {

  /** 'income' | 'expense' — define título e cor do modal */
  @Input() type: TransactionType = 'income';
 
  /** Controla visibilidade — two-way binding com o pai */
  @Input()  visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
 
  /** Emitido ao confirmar; o pai decide o que fazer com os dados */
  @Output() submitted = new EventEmitter<TransactionForm & { type: TransactionType }>();
 
  // ── Config dinâmica por tipo ────────────────────────────────────
  config = {
    income: {
      title:       'Add Income',
      icon:        'pi pi-plus-circle',
      iconClass:   'icon--green',
      btnLabel:    'Add Income',
      btnSeverity: 'success' as const,
    },
    expense: {
      title:       'Add Expense',
      icon:        'pi pi-minus-circle',
      iconClass:   'icon--red',
      btnLabel:    'Add Expense',
      btnSeverity: 'danger' as const,
    },
  };
 
  // ── Opções de método ────────────────────────────────────────────
  methodOptions = [
    { label: 'Bank account', value: 'Bank account' },
    { label: 'Credit card',  value: 'Credit card'  },
  ];
 
  // ── Form ────────────────────────────────────────────────────────
  form: TransactionForm = this.emptyForm();
 
  /** Erros de validação por campo */
  errors: Partial<Record<keyof TransactionForm, string>> = {};
 
  ngOnChanges(changes: SimpleChanges): void {
    // Limpa o formulário sempre que o modal é aberto
    if (changes['visible']?.currentValue === true) {
      this.form   = this.emptyForm();
      this.errors = {};
    }
  }
 
  // ── Ações ───────────────────────────────────────────────────────
  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
 
  submit(): void {
    if (!this.validate()) return;
 
    this.submitted.emit({ ...this.form, type: this.type });
    this.close();
  }
 
  // ── Helpers ─────────────────────────────────────────────────────
  get current() {
    return this.config[this.type];
  }
 
  private emptyForm(): TransactionForm {
    return { description: '', method: '', date: null, amount: null };
  }
 
  private validate(): boolean {
    this.errors = {};
 
    if (!this.form.description?.trim())
      this.errors['description'] = 'Description is required.';
 
    if (!this.form.method)
      this.errors['method'] = 'Please select a payment method.';
 
    if (!this.form.date)
      this.errors['date'] = 'Date is required.';
 
    if (this.form.amount === null || this.form.amount === undefined)
      this.errors['amount'] = 'Amount is required.';
    else if (this.form.amount <= 0)
      this.errors['amount'] = 'Amount must be greater than zero.';
 
    return Object.keys(this.errors).length === 0;
  }

}
