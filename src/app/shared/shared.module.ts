import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCurrencyPipe } from './pipes/currency.pipe';

@NgModule({
  imports: [
    CommonModule,
    AppCurrencyPipe,
  ],
  exports: [
    CommonModule,
    AppCurrencyPipe,
  ],
})
export class SharedNgModule {}