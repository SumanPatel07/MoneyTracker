import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BudgetItem } from 'src/shared/models//budget-item.model';
import { BudgetService } from '../../Services/budget.service';

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

   // ✅ Categories list
  categories: string[] = [];

  // Chart variables
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];
  pieChartType: ChartConfiguration<'pie'>['type'] = 'pie';

  incomeChartLabels: string[] = [];
  incomeChartData: number[] = [];

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.fetchBudgetItems();
  }

  fetchBudgetItems() {
    this.budgetService.getBudgetItems().subscribe(
      (items: BudgetItem[]) => {
        this.budgetItems = items;

        // ✅ Extract unique categories
        this.categories = [...new Set(items.map(i => i.category).filter(Boolean))];

        this.totalIncome = this.budgetItems
          .filter(i => i.type === 'income')
          .reduce((sum, i) => sum + i.amount, 0);
        this.totalBudget = this.budgetItems
          .filter(i => i.type === 'expense')
          .reduce((sum, i) => sum + i.amount, 0);
        this.updateChartData();
      },
      (error) => console.error('Error fetching budget items', error)
    );
  }

  normalizeDate(dateStr: string): string {
  const d = new Date(dateStr);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}

addItem(newItem: BudgetItem) {
  if (newItem.timestamp) {
    // Save exactly what user selects
    newItem.timestamp = this.formatForStorage(newItem.timestamp);
  }
  this.budgetService.addBudgetItem(newItem).subscribe(() => this.fetchBudgetItems());
}

  deleteItem(item: BudgetItem) {
    if (!item._id) return;
    this.budgetService.deleteBudgetItem(item._id).subscribe(
      () => this.fetchBudgetItems(),
      (error) => console.error('Error deleting item', error)
    );
  }

updateItem() {
  if (this.editIndex !== null && this.editedItem._id) {
    if (this.editedItem.timestamp) {
      // Keep timestamp as user entered
      this.editedItem.timestamp = this.formatForStorage(this.editedItem.timestamp);
    }
    this.budgetService.updateBudgetItem(this.editedItem._id, this.editedItem)
      .subscribe(() => {
        this.fetchBudgetItems();
        this.cancelEdit();
      });
  }
}
// Convert the datetime-local string exactly as entered
formatForStorage(dateStr: string): string {
  // No conversion; just return the string
  return dateStr;
}

  getGroupedItemsByDate() {
  const grouped: { [dataLabel: string]: BudgetItem[] } = {};

  for (const item of this.budgetItems) {
    const label = this.getDataLabel(item.timestamp || '');
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(item);
  }

  return grouped;
}

  getDataLabel(timestamp: string): string {
  const [date] = timestamp.split('T'); // split datetime
  const itemDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const itemStr = itemDate.toLocaleDateString();
  const todayStr = today.toLocaleDateString();
  const yestStr = yesterday.toLocaleDateString();

  if (itemStr === todayStr) return 'Today';
  if (itemStr === yestStr) return 'Yesterday';
  return itemStr;
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

    return new Date(label);
  }

  startEdit(item: BudgetItem) {
  this.editIndex = this.budgetItems.indexOf(item);
  this.editedItem = { ...item };
}

  cancelEdit() {
    this.editIndex = null;
    this.editedItem = new BudgetItem('', 0, '', '', '', 'expense');
  }

  getDayTotal(dateLabel: string, type: 'income' | 'expense'): number {
    const items = this.getGroupedItemsByDate()[dateLabel] || [];
    return items
      .filter(i => i.type === type)
      .reduce((sum, i) => sum + i.amount, 0);
  }

  getDailyIncome(items: BudgetItem[]): number {
    return items
      .filter(i => i.type === 'income')
      .reduce((sum, i) => sum + i.amount, 0);
  }

  getDailyExpense(items: BudgetItem[]): number {
    return items
      .filter(i => i.type === 'expense')
      .reduce((sum, i) => sum + i.amount, 0);
  }

  updateChartData() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Helper to parse local datetime string
  const parseLocalDate = (timestamp: string): Date => {
    const [datePart, timePart] = timestamp.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  // EXPENSE chart
  const currentMonthExpenses = this.budgetItems.filter(item => {
    if (!item.timestamp) return false;
    const date = parseLocalDate(item.timestamp);
    return item.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const expenseCategoryTotals: { [category: string]: number } = {};
  for (const item of currentMonthExpenses) {
    const category = item.category || 'Uncategorized';
    expenseCategoryTotals[category] = (expenseCategoryTotals[category] || 0) + item.amount;
  }

  this.pieChartLabels = Object.keys(expenseCategoryTotals);
  this.pieChartData = Object.values(expenseCategoryTotals);

  // INCOME chart
  const currentMonthIncome = this.budgetItems.filter(item => {
    if (!item.timestamp) return false;
    const date = parseLocalDate(item.timestamp);
    return item.type === 'income' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const incomeCategoryTotals: { [category: string]: number } = {};
  for (const item of currentMonthIncome) {
    const category = item.category || 'Uncategorized';
    incomeCategoryTotals[category] = (incomeCategoryTotals[category] || 0) + item.amount;
  }

  this.incomeChartLabels = Object.keys(incomeCategoryTotals);
  this.incomeChartData = Object.values(incomeCategoryTotals);
}

}
