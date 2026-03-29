import { Component } from '@angular/core';
import { DashboardComponent } from 'src/app/features/finance/pages/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [DashboardComponent],
  standalone: true,
  template: `<app-dashboard></app-dashboard>`,
})
export class AppComponent {
  title = 'finance-dashboard';
}
