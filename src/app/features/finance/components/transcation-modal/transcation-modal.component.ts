import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule }       from 'primeng/dialog';
import { ButtonModule }       from 'primeng/button';
import { InputTextModule }    from 'primeng/inputtext';
import { InputNumberModule }  from 'primeng/inputnumber';
import { DividerModule }      from 'primeng/divider';
import { TransactionForm } from 'src/app/features/finance/models/transaction-form';
import { Transaction, TransactionType } from 'src/app/features/finance/models/transaction';
import { Category } from 'src/app/features/finance/models/category';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';

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
    DividerModule,
    SelectModule,
    DatePicker
  ]
})
export class TranscationModalComponent implements OnChanges  {
  @Input() mode: 'create' | 'edit' = 'create';

  /** 'income' | 'expense' — define título e cor do modal */
  @Input() type: TransactionType = 'income';
 
  /** Controla visibilidade — two-way binding com o pai */
  @Input()  visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() categories: Category[] = [];
  @Input() launch: Transaction | null = null;
 
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
    { label: 'Pix', value: 'pix' },
    { label: 'Credit Card', value: 'creditCard' },
    { label: 'Debit Card', value: 'debitCard' },
    { label: 'Cash', value: 'cash' },
  ];
 
  // ── Form ────────────────────────────────────────────────────────
  form: TransactionForm = this.emptyForm();
 
  /** Erros de validação por campo */
  errors: Partial<Record<keyof TransactionForm, string>> = {};
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.form = this.launch ? this.fromLaunch(this.launch) : this.emptyForm();
      this.errors = {};
      return;
    }

    if (changes['launch'] && this.visible) {
      this.form = this.launch ? this.fromLaunch(this.launch) : this.emptyForm();
    }
  }

  get availableCategories(): Category[] {
    return this.categories.filter(category => category.type === this.type);
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

  get submitLabel(): string {
    return this.mode === 'edit' ? 'Update Launch' : this.current.btnLabel;
  }

  get dialogTitle(): string {
    return this.mode === 'edit' ? 'Edit Launch' : this.current.title;
  }
 
  private emptyForm(): TransactionForm {
    return { description: '', value: null, launchDate: null, categoryId: null, paymentMethod: '' };
  }

  private fromLaunch(launch: Transaction): TransactionForm {
    return {
      description: launch.description,
      value: launch.value,
      launchDate: new Date(launch.launchDate),
      categoryId: launch.categoryId,
      paymentMethod: launch.paymentMethod
    };
  }
 
  private validate(): boolean {
    this.errors = {};
 
    if (!this.form.description?.trim())
      this.errors['description'] = 'Description is required.';
 
    if (!this.form.paymentMethod)
      this.errors['paymentMethod'] = 'Please select a payment method.';
 
    if (!this.form.launchDate)
      this.errors['launchDate'] = 'Date is required.';
 
    if (this.form.categoryId === null || this.form.categoryId === undefined)
      this.errors['categoryId'] = 'Category is required.';

    if (this.form.value === null || this.form.value === undefined)
      this.errors['value'] = 'Amount is required.';
    else if (this.form.value <= 0)
      this.errors['value'] = 'Amount must be greater than zero.';
 
    return Object.keys(this.errors).length === 0;
  }

}
