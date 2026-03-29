interface BaseTransaction {
  id: number;
  initials?: string;
  icon?: string;
  description: string;
  method: 'Bank account' | 'Credit card';
  date: string;
  amount: number;
  logoUrl?: string;
}

export interface PersonTransaction extends BaseTransaction {
  type: 'person';
  initials: string;
}

export interface MerchantTransaction extends BaseTransaction {
  type: 'merchant';
  icon: string;
}

export type Transaction = PersonTransaction | MerchantTransaction;

export type TransactionType = 'income' | 'expense';