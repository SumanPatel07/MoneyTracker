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
  totalIncome: number = 0;
  formType: 'income' | 'expense' = 'expense';

  ngOnInit(): void {
    const saved = localStorage.getItem('budgetItems');
    if (saved) {
      this.budgetItems = JSON.parse(saved);
      this.totalBudget = this.budgetItems.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0);
      this.totalIncome = this.budgetItems.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0);
    }
  }

  addItem(newItem: BudgetItem){
    this.budgetItems.push(newItem);

    if (newItem.type === 'income') {
      this.totalIncome += newItem.amount;
    } else {
      this.totalBudget += newItem.amount;
    }

    this.budgetItems.sort((a, b) => {
      const dateA = new Date(a.timestamp || '');
      const dateB = new Date(b.timestamp || '');
      return dateB.getTime() - dateA.getTime();
    });
    localStorage.setItem('budgetItems', JSON.stringify(this.budgetItems));
  }

  deleteItem(item: BudgetItem) {
    const index = this.budgetItems.indexOf(item);
    if (index > -1) {
      this.budgetItems.splice(index, 1);

      if (item.type === 'income') {
        this.totalIncome -= item.amount;
      } else {
       this.totalBudget -= item.amount;
      }

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
    const keys = Object.keys(this.getGroupedItemsByDate());
      
      return keys.sort((a, b) => {
      const dateA = this.convertToDate(a);
      const dateB = this.convertToDate(b);
      return dateB.getTime() - dateA.getTime();
    });
  }

  convertToDate(label: string): Date {
    const today = new Date();
    if (label === 'Today') return today;

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (label === 'Yesterday') return yesterday;

    // fallback: parse actual date
    return new Date(label);
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
    if(this.editedItem.name.trim() && this.editedItem.amount > 0 && this.editedItem.category) 
      {
        const currentItem = this.budgetItems[this.editIndex!];

        if(currentItem.type === 'income')
        {
          this.totalIncome -= currentItem.amount;
        }
        else {
          this.totalBudget -= currentItem.amount;
        }

        this.budgetItems[this.editIndex!] = {...this.editedItem};

        if (this.editedItem.type === 'income') {
          this.totalIncome += this.editedItem.amount;
        } else {
          this.totalBudget += this.editedItem.amount;
        }

        localStorage.setItem('budgetItems', JSON.stringify(this.budgetItems));

        this.cancelEdit();
    }
  }
  
  getDayTotal(dateLabel: string, type: 'income' | 'expense'): number {
    const items = this.getGroupedItemsByDate()[dateLabel] || [];
    return items
      .filter(i => i.type === type)
      .reduce((sum, i) => sum + i.amount, 0);
  }
}
