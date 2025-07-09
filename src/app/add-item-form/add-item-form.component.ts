import { Component, EventEmitter, Output } from '@angular/core';
import { BudgetItem } from 'src/shared/models/budget-item.model';

@Component({
  selector: 'app-add-item-form',
  templateUrl: './add-item-form.component.html',
  styleUrls: ['./add-item-form.component.scss']
})
export class AddItemFormComponent {
  @Output() formSubmit: EventEmitter<BudgetItem> = new EventEmitter<BudgetItem>();

  name: string = '';
  amount: number = 0;
  category: string = 'Food';
  details: string = '';
  timestamp: string = new Date().toISOString().substring(0, 16);   // yyyy-MM-ddTHH:mm

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
    if (!this.name || this.amount <= 0 || !this.category) return;

    const newItem = new BudgetItem(
      this.name,
      this.amount,
      this.category,
      this.details,
      this.timestamp
    );

    this.formSubmit.emit(newItem);

    //Reset the form
    this.name = '';
    this.amount = 0;
    this.category = 'Food';
    this.details = '';
    this.timestamp = new Date().toISOString().substring(0, 16);
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
