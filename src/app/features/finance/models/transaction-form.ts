export interface TransactionForm {
  description: string;
  method: 'Bank account' | 'Credit card' | '';
  date: Date | null;
  amount: number | null;
}