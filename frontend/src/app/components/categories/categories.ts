import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Category } from '../../models/interfaces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  name = '';
  description = '';
  errorMessage = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить категории.';
      }
    });
  }

  createCategory() {
    const name = this.name.trim();
    const description = this.description.trim();

    if (!name) {
      this.errorMessage = 'Название категории обязательно.';
      return;
    }

    this.api.createCategory({
      name,
      description
    }).subscribe({
      next: (category) => {
        this.categories = [...this.categories, category];
        this.name = '';
        this.description = '';
        this.errorMessage = '';
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error, 'Не удалось создать категорию.');
      }
    });
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
