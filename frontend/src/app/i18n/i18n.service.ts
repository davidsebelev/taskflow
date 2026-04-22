import { Injectable, signal } from '@angular/core';
import { Language, translations } from './translations';

const STORAGE_KEY = 'taskflow.language';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly currentLanguage = signal<Language>(this.getInitialLanguage());

  readonly language = this.currentLanguage.asReadonly();

  setLanguage(language: Language) {
    this.currentLanguage.set(language);
    localStorage.setItem(STORAGE_KEY, language);
  }

  t(key: string): string {
    const selected = translations[this.currentLanguage()]?.[key];
    if (selected) {
      return selected;
    }

    return translations.en[key] ?? key;
  }

  private getInitialLanguage(): Language {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'ru' || stored === 'kk' ? stored : 'en';
  }
}