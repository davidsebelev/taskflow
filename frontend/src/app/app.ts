import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './i18n/i18n.service';
import { Language } from './i18n/translations';
import { TranslatePipe } from './i18n/translate.pipe';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  constructor(public i18n: I18nService) {}

  setLanguage(language: string) {
    if (language === 'en' || language === 'ru' || language === 'kk') {
      this.i18n.setLanguage(language as Language);
    }
  }
}
