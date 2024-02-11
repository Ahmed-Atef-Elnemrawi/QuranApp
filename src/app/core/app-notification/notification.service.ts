import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  #isActiveSub = new Subject<boolean>();
  isActive$ = this.#isActiveSub.asObservable();

  #messageSub = new Subject<string>();
  message$ = this.#messageSub.asObservable();

  notify(message: string) {
    if (message !== '') {
      this.#messageSub.next(message);
      this.#isActiveSub.next(true);
    }
  }

  hide() {
    this.#isActiveSub.next(false);
  }
}
