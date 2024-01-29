import { Signal } from '@angular/core';
import { Language } from './language';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppSetting {
  currentLanguage: Signal<string>;
  currentLanguage$: Observable<string>;
  isDarkMode: Signal<boolean>;
  toggleMode: () => void;
  changeLanguage: (lang: Language) => void;
}
