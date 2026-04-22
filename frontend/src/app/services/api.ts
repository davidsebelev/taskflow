import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, CreateCategoryPayload, CreateTaskPayload, Task } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  createCategory(category: CreateCategoryPayload) {
    return this.http.post<Category>(`${this.apiUrl}/categories/`, category);
  }

  getTasks() {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/`);
  }

  createTask(task: CreateTaskPayload) {
    return this.http.post<Task>(`${this.apiUrl}/tasks/`, task);
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.apiUrl}/tasks/${id}/`);
  }
}
