import { Component, Input, OnInit } from '@angular/core';
import { SummaryCard } from 'src/app/features/finance/models/summary-card';
import { SharedNgModule } from 'src/app/shared/shared.module';


@Component({
  selector: 'app-summary-card',
  standalone: true,
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
  imports: [SharedNgModule]
})
export class SummaryCardComponent implements OnInit {

  @Input() summary: SummaryCard[] = [];

  constructor() {}

  ngOnInit() {    
  }

  isPositive(value: number): boolean {
    return value >= 0;
  }
}
