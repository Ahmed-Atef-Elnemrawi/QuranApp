import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './app-header/app-header.component';
import { APP_SETTING } from './core';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { LocalStorageService } from './core/storage.service';
import { Utils } from './shared/dom.utils';
import { Subject, takeUntil, tap } from 'rxjs';
import { Language } from './core/model/language';
import { AppNotificationComponent } from './core/app-notification/notification.component';
import { AppNavigation } from './app-nav/app-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppHeaderComponent, AppFooterComponent, AppNotificationComponent, AppNavigation],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  #appSetting = inject(APP_SETTING);
  #localStorage = inject(LocalStorageService);
  #utils = new Utils();
  #destroy$ = new Subject<void>();

  title = 'QuranApp';

  @HostBinding('class.dark') get isDarkMode() {
    return this.#appSetting.isDarkMode();
  }

  ngOnInit() {
    this.loadCurrentLang();
    this.updatePageDirectionBasedOnLang();
  }

  //to retrieve the user selected persisted language to apply it again in case of the user reload the page.
  private loadCurrentLang() {
    const langObj = this.#localStorage.getItem<Language>('langObj')!;
    this.#appSetting.changeLanguage(langObj);
  }

  private updatePageDirectionBasedOnLang() {
    const mainContent = this.#utils.queryById('main-content');
    if (mainContent) {
      this.#appSetting.currentLanguage$
        .pipe(
          tap(() => {
            const currLang = this.#appSetting.currentLanguage();
            const isEng = currLang === 'English';
            mainContent.dir = isEng ? 'ltr' : 'rtl';
            mainContent.lang = isEng ? 'en' : 'ar';
          }),
          takeUntil(this.#destroy$)
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}
