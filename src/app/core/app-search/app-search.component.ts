import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Output,
  inject,
  input,
  signal,
} from '@angular/core';
import { Utils } from '../../shared/dom.utils';
import { AppSearchService } from './app.search.service';
import {
  Observable,
  debounceTime,
  fromEvent,
  map,
  switchMap,
} from 'rxjs';
import { Reciter } from '../model/reciter';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'search-result',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  providers: [AppSearchService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      id="container"
      class="w-dvw h-dvh flex place-content-center place-items-center bg-transparent fixed top-0 left-0
      right-0 bottom-0 z-[50]"
      *ngIf="isActive()"
    >
      <div
        id="search-result"
        class="w-[90dvw] sm:w-[45dvw] h-[50dvh] bg-background rounded-sm shadow-2xl ring-1 ring-primary px-4 py-4 box-border"
      >
        <input
          type="text"
          id="search-input"
          (focus)="onfocus()"
          placeholder="Enter your search term to display the results."
          class="block w-full h-10 appearance-none bg-transparent rounded-sm  outline-none px-5 border-b-2 border-container text-[14px] placeholder:max-sm:text-sm"
        />

        @if(result$ | async; as result){
        <div
          id="result"
          class="flex flex-col gap-y-3 place-items-start h-[calc(50dvh-84px)] px-4 py-4 overflow-y-scroll "
        >
          @for (item of result; track $index) {
          <button
            class="hover:opacity-65 capitalize"
            (click)="onClose()"
            [routerLink]="['/reciters', item.id]"
            [innerHTML]="item.name"
          ></button>
          } @empty {
          <p
            class=" capitalize absolute top-1/2 opacity-60 -translate-y-1/2 left-1/2 -translate-x-1/2"
          >
            No results found.
          </p>
          }
        </div>
        } @else {
        <loader *ngIf="isLoading()"></loader>
        }
      </div>
    </div>
  `,
})
export class SearchResult {
  isActive = input<boolean>(false);
  @Output() close = new EventEmitter();

  private utils = new Utils();
  private searchService = inject(AppSearchService);

  result$!: Observable<Reciter[]>;
  isLoading = signal(false);

  @HostListener('click', ['$event'])
  onClick(e: Event) {
    const container = this.utils.queryById('container');
    if (e.target && e.target === container) {
      this.close.emit();
    }
  }

  onfocus(): void {
    const input = this.utils.getHostEl().querySelector('#search-input')!;
    this.result$ = fromEvent(input, 'input').pipe(
      debounceTime(800),
      switchMap((e) => {
        const keyword = (e.target as HTMLInputElement).value;
        this.isLoading.update(() => !!keyword);
        return this.search(keyword);
      })
    );
  }

  search(keyword: string) {
    return this.searchService.search(keyword).pipe(
      map((results) =>
        results.map((result) => ({
          ...result,
          name: result.name
            .toLocaleLowerCase()
            .replace(
              new RegExp(keyword, 'gi'),
              (match) => `<span class="bg-secondary p-0.5">${match}</span>`
            ),
        }))
      )
    );
  }

  onClose() {
    this.close.emit();
  }
}
