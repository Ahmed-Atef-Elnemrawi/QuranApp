import { Injectable, inject } from '@angular/core';
import { BACKEND_URL } from '../../core';
import { HttpClient } from '@angular/common/http';
import { delay, map, shareReplay, switchMap } from 'rxjs';
import { Reciter } from '../../core/model/reciter';
import { Surah } from '../../core/model/surah';

@Injectable()
export class RecitersService {
  #backendUrl = inject(BACKEND_URL);
  #httpClient = inject(HttpClient);

  getReciters() {
    return this.#backendUrl.recitersUrl$.pipe(
      switchMap((url) => this.#httpClient.get<{ reciters: Reciter[] }>(url)),
      shareReplay(1)
    );
  }

  getReciter(reciterId: string) {
    return this.#backendUrl.recitersUrl$.pipe(
      switchMap((url) =>
        this.#httpClient.get<{ reciters: Reciter[] }>(
          url + `&&reciter=${reciterId}`
        )
      )
    );
  }

  getRewaya(reciterId: number, rewayaId: number) {
    return this.#backendUrl.recitersUrl$.pipe(
      switchMap((url) =>
        this.#httpClient.get<{ reciters: Reciter[] }>(
          url + `&reciter=${reciterId}&rewaya=${rewayaId}`
        )
      )
    );
  }

  getSuraList() {
    return this.#backendUrl.suwarUrl$.pipe(
      switchMap((url) =>
        this.#httpClient.get<{ suwar: Surah[] }>(url).pipe(
          map(({ suwar }) =>
            suwar.map((surah) => ({
              id: surah.id.toString().padStart(3, '0'),
              name: surah.name,
              type: surah.makkia,
            }))
          )
        )
      ),
      shareReplay(1)
    );
  }
}
