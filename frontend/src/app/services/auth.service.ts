import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AuthResponse } from '../models/interfaces';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any) {
    // эндпоинт для получения SimpleJWT токена
    return this.http.post<AuthResponse>(`${this.apiUrl}/token/`, credentials).pipe(
      tap(response => localStorage.setItem('token', response.access))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}