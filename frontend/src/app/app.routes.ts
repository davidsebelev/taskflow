import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { TasksComponent } from './components/tasks/tasks';
import { CategoriesComponent } from './components/categories/categories';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'categories', component: CategoriesComponent }
];