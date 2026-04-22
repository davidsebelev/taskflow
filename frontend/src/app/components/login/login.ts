import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router, private i18n: I18nService) {}

  onLogin() {
    const creds = { username: this.username, password: this.password };
    this.auth.login(creds).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => alert(this.i18n.t('login.errorInvalid'))
    });
  }
}