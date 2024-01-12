import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subscription, fromEvent, debounceTime, tap } from 'rxjs';
import { Utils } from '../../core/shared/dom.utils';

@Component({
  selector: 'header-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <span
      id="search-btn"
      class="block w-fit h-fit cursor-pointer hover:bg-secondary bg-primary m-auto p-1.5 rounded-sm sm:hidden"
    >
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
        class="stroke-text"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0" />

        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <g id="SVGRepo_iconCarrier">
          <path
            d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </span>

    <div id="form-container" class="hidden sm:block z-50">
      <div id="search-form" class="w-fit shadow-sm flex">
        <input
          type="text"
          [(ngModel)]="query"
          class="w-[30dvw] bg-container appearance-none border-none outline-none p-1.5 order-2 rounded-tr-sm rounded-br-sm"
        />

        <span
          class="bg-accent block w-fit h-fit m-auto p-1.5 rounded-tl-sm rounded-bl-sm order-1"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            class="stroke-text"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <path
                d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </span>

        <span
          id="close-btn"
          class="bg-accent block w-fit h-fit m-auto p-1.5 rounded-tl-sm rounded-bl-sm order-3 sm:hidden hover:bg-secondary"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            class="stroke-text"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <g id="Menu / Close_SM">
                <path
                  id="Vector"
                  d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </g>
          </svg>
        </span>
      </div>
    </div>
  `,
  styles: `
    .form-container{
      @apply bg-background w-dvw h-16 flex place-content-center place-items-center z-50 top-0 bottom-0 left-0 right-0 absolute;

      >#search-form > input{
        width:100%
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  #sub!: Subscription;
  #utils = new Utils();

  @Output() queryChanged = new EventEmitter<string>();

  query = '';

  @HostListener('window:resize', ['$event'])
  onResize($event: Event) {
    const formContainer = this.#utils.queryById('form-container')!;
    const searchBtn = this.#utils.queryById('search-btn')!;

    if (window.matchMedia('min-width: 640px')) {
      this.#utils
        .removeClass(formContainer, 'form-container')
        .addClass(formContainer, 'hidden')
        .removeClass(searchBtn, 'hidden');
    }
  }

  ngAfterViewInit(): void {
    const searchBtn = this.#utils.queryById('search-btn');
    const container = this.#utils.queryById('form-container');
    const closeBtn = this.#utils.queryById('close-btn');

    this.#utils.listenTo(searchBtn!, 'click', () => {
      this.#utils
        .removeClass(container, 'hidden')
        .addClass(searchBtn, 'hidden')
        .addClass(container, 'form-container');
    });

    this.#utils.listenTo(closeBtn!, 'click', () => {
      this.#utils
        .removeClass(container, 'form-container')
        .addClass(container, 'hidden')
        .removeClass(searchBtn, 'hidden');
    });
  }

  ngOnInit(): void {
    this.#sub = fromEvent(this.#utils.getHostEl(), 'input')
      .pipe(
        debounceTime(1000),
        tap(() => this.queryChanged.emit(this.query))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.#sub.unsubscribe();
  }
}
