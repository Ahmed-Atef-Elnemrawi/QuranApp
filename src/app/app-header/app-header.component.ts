import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { APP_SETTING } from '../core';
import { LangComponent } from './ui/lang.component';
import { ModeComponent } from './ui/mode.component';
import { SearchComponent } from './ui/search.component';
import { DataService } from './data-access/data.service';
import { Language } from '../core/model/language';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    LangComponent,
    ModeComponent,
    SearchComponent
  ],
  providers: [DataService],
  template: `
    <div
      class="w-dvw h-16 flex place-content-between place-items-center shadow-md px-4 relative bg-background"
    >
      <div class="logo font-bold text-xl/none ">
        Quran <br />
        Kareem
      </div>
      <header-search></header-search>
      <div class="settings flex place-content-around space-x-2.5">
        <header-lang
          [languages]="languages()"
          (langChanged)="changeLanguage($event)"
        />
        <mode [isDarkMode]="isDark()" (modeChanged)="toggleMode()" />
      </div>
    </div>
  `,
  styles: `
    :host{
      z-index:50;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {
  #appSetting = inject(APP_SETTING);
  #service = inject(DataService);

  languages = this.#service.getLanguage();
  isDark = this.#appSetting.isDarkMode;

  toggleMode() {
    this.#appSetting.toggleMode();
  }

  changeLanguage(lang: Language) {
    this.#appSetting.changeLanguage(lang);
  }
}
