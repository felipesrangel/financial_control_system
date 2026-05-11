export type PaymentMethodValue = 'pix' | 'creditCard' | 'debitCard' | 'cash';

export interface LaunchRequest {
  description: string;
  value: number;
  launchDate: string;
  categoryId: number;
  paymentMethod: PaymentMethodValue;
  createdAt: string;
  updatedAt: string;
}

export interface LaunchResponse extends LaunchRequest {
  id: number;
}