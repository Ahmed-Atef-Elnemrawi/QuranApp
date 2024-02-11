import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Utils } from '../../shared/dom.utils';
import { APP_SETTING } from '../../core';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Language } from '../../core/model/language';

@Component({
  selector: 'header-lang',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-20 h-fit">
      <input
        type="text"
        class="appearance-none border-none outline-none absolute top-0 left-0 min-w-full w-full h-fit cursor-pointer bg-background capitalize text-center font-medium rounded-sm"
        [value]="value"
        readonly
      />
      <div
        id="options"
        class="absolute top-8 w-full bg-background rounded-sm shadow-sm
        shadow-primary ring-1 ring-primary ring-opacity-5 overflow-hidden hidden"
      >
        @if(languages){ @for (lang of languages ; track $index) {
        <div
          class="py-2 cursor-pointer hover:bg-primary text-center capitalize"
          (click)="onLangChange(lang)"
        >
          {{ lang.native }}
        </div>
        } }
      </div>
    </div>
  `,
  styles: `
  :host{
    z-index:40
  }
  `,
})
export class LangComponent implements AfterViewInit {
  #utils = new Utils();
  #appSetting = inject(APP_SETTING);

  @Input() languages: Language[] | undefined;
  @Output() langChanged = new EventEmitter<Language>();

  value = 'english';
  options: { [key: string]: string } = {
    العربية: 'Arabic',
    english: 'English',
  };

  constructor() {
    this.#appSetting.currentLanguage$
      .pipe(
        tap((val) => {
          this.value = val === 'English' ? 'English' : 'العربية';
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    const options = this.#utils.queryById('options');

    this.#utils.listenTo(this.#utils.getHostEl(), 'click', () => {
      options!.classList.toggle('hidden');
    });

    this.#utils.listenTo(this.#utils.getHostEl(), 'mouseleave', () =>
      options!.classList.add('hidden'))
  }

  onLangChange(lang: Language) {
    this.value = lang.native;
    this.langChanged.emit(lang);
  }
}
