import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { Category, Task } from '../../models/interfaces';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  newTaskTitle = '';
  newTaskDesc = '';
  selectedCategoryId: number | null = null;
  searchQuery = '';
  errorMessage = '';

  constructor(private api: ApiService, private auth: AuthService) {}

  get filteredTasks(): Task[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.tasks;
    }

    return this.tasks.filter((task) => {
      const categoryName = this.getCategoryName(task.category).toLowerCase();

      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        categoryName.includes(query)
      );
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadTasks();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        const firstCategoryId = data[0]?.id ?? null;
        if (!this.selectedCategoryId && firstCategoryId !== null) {
          this.selectedCategoryId = firstCategoryId;
        }
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить категории.';
      }
    });
  }

  loadTasks() {
    this.api.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить задачи.';
      }
    });
  }

  createTask() {
    const title = this.newTaskTitle.trim();
    const description = this.newTaskDesc.trim();

    if (!title) {
      this.errorMessage = 'Название задачи обязательно.';
      return;
    }

    if (!this.selectedCategoryId) {
      this.errorMessage = 'Сначала создай хотя бы одну категорию.';
      return;
    }

    const task = {
      title,
      description,
      category: this.selectedCategoryId,
      completed: false
    };
    this.api.createTask(task).subscribe({
      next: () => {
        this.errorMessage = '';
        this.loadTasks();
        this.newTaskTitle = '';
        this.newTaskDesc = '';
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error, 'Не удалось создать задачу.');
      }
    });
  }

  deleteTask(id: number) {
    this.api.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: () => {
        this.errorMessage = 'Не удалось удалить задачу.';
      }
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find((category) => category.id === categoryId)?.name ?? 'Без категории';
  }

  logout() {
    this.auth.logout();
  }

  private getErrorMessage(error: HttpErrorResponse, fallbackMessage: string): string {
    const { error: response } = error;

    if (typeof response === 'string' && response.trim()) {
      return response;
    }

    if (response && typeof response === 'object') {
      const message = Object.entries(response)
        .flatMap(([field, value]) => {
          const messages = Array.isArray(value) ? value : [value];
          return messages
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => `${field}: ${item}`);
        })
        .join(' ');

      if (message) {
        return message;
      }
    }

    return fallbackMessage;
  }
}
