import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Utils } from '../../shared/dom.utils';
import { Observable, Subject, single, tap } from 'rxjs';
import { animate, spring } from 'motion';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      *ngIf="isActive$ | async"
      class="w-[96dvw] hidden px-4 sm:flex flex-col place-content-start py-2.5 place-items-center bg-container h-24 rounded-md shadow-lg sm:w-[25dvw] ring-1 ring-primary"
    >

    <p
      class="font-medium"
      >
      Notification
    </p>
    <p
      class="py-2 capitalize opacity-85">
      {{ message }}
    </p>
    </div>
  `,
  styles: `
    :host{
      @apply w-fit h-fit absolute right-3 bottom-0
    }
  `,
})
export class AppNotificationComponent implements OnInit {
  #utils = new Utils();
  #service = inject(NotificationService);

  message = '';
  isActive$!: Observable<boolean>;

  ngOnInit(): void {
    this.isActive$ = this.#service.isActive$.pipe(
      tap((val) => {
        if (val) {
          this.notify();
        }
      })
    );

    this.#service.message$.subscribe((msg) => (this.message = msg));
  }

  notify() {
    const host = this.#utils.getHostEl();
    animate(
      host,
      {
        x: ['100%', '0%', '0%', '0%', '0%', '100%'],
      },
      { duration: 3.8, easing: 'linear' }
    );

    setTimeout(() => {
      this.#service.hide();
    }, 3800);
  }
}
