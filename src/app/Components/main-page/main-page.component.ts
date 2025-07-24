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

   addItem(newItem: BudgetItem) {
    this.budgetService.addBudgetItem(newItem).subscribe(
      () => {
        this.fetchBudgetItems();

        // ✅ Add new category to list if not present
        if (newItem.category && !this.categories.includes(newItem.category)) {
          this.categories.push(newItem.category);
        }
      },
      (error) => console.error('Error adding item', error)
    );
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
      this.budgetService.updateBudgetItem(this.editedItem._id, this.editedItem).subscribe(
        () => {
          // ✅ Update categories after edit
          if (
            this.editedItem.category &&
            !this.categories.includes(this.editedItem.category)
          ) {
            this.categories.push(this.editedItem.category);
          }
          
          this.fetchBudgetItems();
          this.cancelEdit();
        },
        (error) => console.error('Error updating item', error)
      );
    }
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
    const itemDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const itemStr = itemDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yestStr = yesterday.toISOString().split('T')[0];

    if (itemStr === todayStr) return 'Today';
    if (itemStr === yestStr) return 'Yesterday';
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

    //EXPENSE chart
    const currentMonthExpenses = this.budgetItems.filter(item => {
      const date = new Date(item.timestamp || '');
      return item.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const expensecategoryTotals: { [category: string]: number } = {};

    for (const item of currentMonthExpenses) {
      const category = item.category || 'Uncategorized';
      expensecategoryTotals[category] = (expensecategoryTotals[category] || 0) + item.amount;
    }

    this.pieChartLabels = Object.keys(expensecategoryTotals);
    this.pieChartData = Object.values(expensecategoryTotals);

    //INCOME chart
    const currentMonthIncome = this.budgetItems.filter(item => {
      const date = new Date(item.timestamp || '');
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
