export interface TransactionForm {
  description: string;
  value: number | null;
  launchDate: Date | null;
  categoryId: number | null;
  paymentMethod: 'pix' | 'creditCard' | 'debitCard' | 'cash' | '';
}