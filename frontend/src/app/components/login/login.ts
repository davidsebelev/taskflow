import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    const creds = { username: this.username, password: this.password };
    this.auth.login(creds).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => alert('Неверные данные или ошибка сервера')
    });
  }
}