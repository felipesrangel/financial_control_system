import { Component, OnInit } from '@angular/core';
import { SummaryCard } from 'src/app/features/finance/models/summary-card';
import { FinanceService } from 'src/app/features/finance/services/finance.service';
import { SharedNgModule } from 'src/app/shared/shared.module';


@Component({
  selector: 'app-summary-card',
  standalone: true,
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
  imports: [SharedNgModule]
})
export class SummaryCardComponent implements OnInit {

  summary: SummaryCard[] = [];

  constructor(private financeService: FinanceService) {}

  ngOnInit() {
    this.summary = this.financeService.getSummary();
    
  }

  isPositive(value: number): boolean {
    return value >= 0;
  }
}
