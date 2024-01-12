import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  private getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  private setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  selectIsDarkMode(): boolean {
    return this.getItem<boolean>('isDarkMode') ?? false;
  }

  setDarkMode(value: boolean): void {
    this.setItem('isDarkMode', value);
  }

  selectLanguage(): string {
    return this.getItem<string>('language') ?? 'eng';
  }

  setLanguage(lang: string): void {
    this.setItem('language', lang);
  }
}
