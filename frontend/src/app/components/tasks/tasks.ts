import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { Category, Comment, Task } from '../../models/interfaces';
import { I18nService } from '../../i18n/i18n.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  commentsByTask: Record<number, Comment[]> = {};
  newCommentByTask: Record<number, string> = {};
  newTaskTitle = '';
  newTaskDesc = '';
  selectedCategoryId: number | null = null;
  searchQuery = '';
  errorMessage = '';

  constructor(private api: ApiService, private auth: AuthService, private i18n: I18nService) {}

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
        this.errorMessage = this.i18n.t('tasks.errorLoadCategories');
      }
    });
  }

  loadTasks() {
    this.api.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.commentsByTask = {};
        this.loadCommentsForTasks(data);
      },
      error: () => {
        this.errorMessage = this.i18n.t('tasks.errorLoadTasks');
      }
    });
  }

  createTask() {
    const title = this.newTaskTitle.trim();
    const description = this.newTaskDesc.trim();

    if (!title) {
      this.errorMessage = this.i18n.t('tasks.errorTitleRequired');
      return;
    }

    if (!this.selectedCategoryId) {
      this.errorMessage = this.i18n.t('tasks.errorNeedCategory');
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
        this.errorMessage = this.getErrorMessage(error, this.i18n.t('tasks.errorCreateTask'));
      }
    });
  }

  deleteTask(id: number) {
    this.api.deleteTask(id).subscribe({
      next: () => {
        delete this.commentsByTask[id];
        delete this.newCommentByTask[id];
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = this.i18n.t('tasks.errorDeleteTask');
      }
    });
  }

  getComments(taskId: number | undefined): Comment[] {
    if (!taskId) {
      return [];
    }

    return this.commentsByTask[taskId] ?? [];
  }

  createComment(taskId: number | undefined) {
    if (!taskId) {
      return;
    }

    const text = this.newCommentByTask[taskId]?.trim() ?? '';

    if (!text) {
      this.errorMessage = this.i18n.t('tasks.errorCommentRequired');
      return;
    }

    this.api.createTaskComment(taskId, { text }).subscribe({
      next: () => {
        this.errorMessage = '';
        this.newCommentByTask[taskId] = '';
        this.loadComments(taskId);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error, this.i18n.t('tasks.errorCreateComment'));
      }
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find((category) => category.id === categoryId)?.name ?? this.i18n.t('tasks.noCategory');
  }

  logout() {
    this.auth.logout();
  }

  private loadCommentsForTasks(tasks: Task[]) {
    tasks.forEach((task) => {
      if (task.id) {
        this.loadComments(task.id);
      }
    });
  }

  private loadComments(taskId: number) {
    this.api.getTaskComments(taskId).subscribe({
      next: (comments) => {
        this.commentsByTask[taskId] = comments;
      },
      error: () => {
        this.commentsByTask[taskId] = [];
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
