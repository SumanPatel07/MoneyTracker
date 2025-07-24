import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BudgetItem } from '../../shared/models/budget-item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
private apiUrl = 'https://moneytracker-dor8.onrender.com/api/items';

  constructor(private http: HttpClient) {}

  getBudgetItems(): Observable<BudgetItem[]> {
    return this.http.get<BudgetItem[]>(this.apiUrl);
  }

  addBudgetItem(item: BudgetItem): Observable<BudgetItem> {
    return this.http.post<BudgetItem>(this.apiUrl, item);
  }

  deleteBudgetItem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateBudgetItem(id: string, item: BudgetItem): Observable<BudgetItem> {
    return this.http.put<BudgetItem>(`${this.apiUrl}/${id}`, item);
  }
}
