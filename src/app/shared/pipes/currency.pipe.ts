import { Pipe, PipeTransform, inject, LOCALE_ID } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'appCurrency',
  standalone: true
})
export class AppCurrencyPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);
  private currencyPipe = new CurrencyPipe(this.locale);

  transform(value: number | null | undefined): string {
    if (value == null) return '';
    return this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2') ?? '';
  }
}