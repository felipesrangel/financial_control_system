import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-action-card',
  standalone: true,
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss'],
  imports: []
})
export class ActionCardComponent {

  @Output() actionClick = new EventEmitter<'income' | 'expense'>();

  onIncomeClick() {
    this.actionClick.emit('income');
  }

  onExpenseClick() {
    this.actionClick.emit('expense');
  }
}
