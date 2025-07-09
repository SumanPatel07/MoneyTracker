import { Component, OnInit } from '@angular/core';
import { BudgetItem } from 'src/shared/models//budget-item.model';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  budgetItems: BudgetItem[] = [];
  totalBudget: number = 0;
  editIndex: number | null = null;
  editedItem: BudgetItem = new BudgetItem('',0,'','','');

  ngOnInit(): void {
    const saved = localStorage.getItem('budgetItems');
    if (saved) {
      this.budgetItems = JSON.parse(saved);
      this.totalBudget = this.budgetItems.reduce((sum, item) => sum + item.amount, 0);
    }
  }

  addItem(newItem: BudgetItem){
    this.budgetItems.push(newItem);
    this.totalBudget += newItem.amount;
    localStorage.setItem('budgetItems', JSON.stringify(this.budgetItems));
  }

  deleteItem(item: BudgetItem) {
    const index = this.budgetItems.indexOf(item);
    if (index > -1) {
      this.budgetItems.splice(index, 1);
      this.totalBudget -= item.amount;
      localStorage.setItem('budgetItems', JSON.stringify(this.budgetItems));
    }
  }

  getGroupedItemsByDate() {
    const grouped: { [dataLabel: string]: BudgetItem[] } = {};

    for (const item of this.budgetItems) {
      const label = this.getDataLabel(item.timestamp || '');
      if(!grouped[label]) grouped[label] = [];
        grouped[label].push(item);
    }

    return grouped;
  }

  getDataLabel(timestamp: string): string {
    const itemDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const itemStr = itemDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yestStr = yesterday.toISOString().split('T')[0];

    if(itemStr === todayStr) return 'Today';
    if(itemStr === yestStr) return 'Yesterday';
    return itemDate.toLocaleDateString();
  }

  getGroupedKeys(): string[] {
    return Object.keys(this.getGroupedItemsByDate());
  }

  startEdit(item: BudgetItem) {
    this.editIndex = this.budgetItems.indexOf(item);
    this.editedItem = {...item};
  }

  cancelEdit() {
    this.editIndex = null;
    this.editedItem = new BudgetItem('',0,'','','');
  }

  updateItem() {
    if(this.editedItem.name.trim() && this.editedItem.amount > 0 && this.editedItem.category) {
      this.budgetItems[this.editIndex!] = {...this.editedItem};
      this.totalBudget = this.budgetItems.reduce((sum, item) => sum + item.amount, 0);
      localStorage.setItem('budgetItems', JSON.stringify(this.budgetItems));
      this.cancelEdit();
    }
  }
}
