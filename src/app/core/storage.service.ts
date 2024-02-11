import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  selectIsDarkMode(): boolean {
    return this.getItem<boolean>('isDarkMode') ?? false;
  }

  setDarkMode(value: boolean): void {
    this.setItem('isDarkMode', value);
  }

  selectLanguage(): string {
    return this.getItem<string>('language') ?? 'English';
  }

  setLanguage(lang: string): void {
    this.setItem('language', lang);
  }
}
