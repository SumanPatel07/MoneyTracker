import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BudgetItem } from 'src/shared/models/budget-item.model';

@Component({
  selector: 'app-add-item-form',
  templateUrl: './add-item-form.component.html',
  styleUrls: ['./add-item-form.component.scss']
})
export class AddItemFormComponent {
  @Output() formSubmit: EventEmitter<BudgetItem> = new EventEmitter<BudgetItem>();
  @Input() type: 'income' | 'expense' = 'expense';


  name: string = '';
  amount: number | null = null;
  category: string = 'Food';
  details: string = '';
  timestamp: string = this.getCurrentISTDateTime();  // yyyy-MM-ddTHH:mm

  categories: string[] = ['Food', 'Transport', 'Clothing', 'Hotwheels'];
  showNewCategoryInput: boolean = false;
  newCategoryName: string = '';
  categorySearch: string = '';

  ngOnInit(): void {
    const saved = localStorage.getItem('categories');
    if(saved) {
      this.categories = JSON.parse(saved);
    }
  }

  onSubmit() {
    if (!this.name || this.amount === null || this.amount <= 0 || !this.category) return;

    const newItem = new BudgetItem(
      this.name,
      this.amount,
      this.category,
      this.details,
      this.timestamp,
      this.type
    );

    this.formSubmit.emit(newItem);

    //Reset the form
    this.name = '';
    this.amount = 0;
    this.category = 'Food';
    this.details = '';
    this.timestamp = new Date().toISOString().substring(0, 16);
  }

  getCurrentISTDateTime(): string {
  const now = new Date();

  // IST offset in minutes
  const IST_OFFSET_MINUTES = -330;

  // Check if user is already in IST
  if (now.getTimezoneOffset() === IST_OFFSET_MINUTES) {
    return this.formatDateTimeForInput(now);
  }

  // If not in IST, convert to IST
  const istTime = new Date(now.getTime() + (IST_OFFSET_MINUTES - now.getTimezoneOffset()) * 60000);
  return this.formatDateTimeForInput(istTime);
}

formatDateTimeForInput(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


  showCategoryForm() {
    this.showNewCategoryInput = true;
    this.newCategoryName = '';
  }

  saveNewCategory() {
    const categoryName = this.newCategoryName.trim();
    if(categoryName && !this.categories.includes(categoryName)) {
      this.categories.push(categoryName);
      localStorage.setItem('categories', JSON.stringify(this.categories));
    }
    this.category = categoryName;
    this.showNewCategoryInput = false;
    this.newCategoryName = '';
  }

  get filteredCategories() {
    return this.categories.filter(c => c.toLocaleLowerCase().includes(this.categorySearch.toLocaleLowerCase()));
  }
}
