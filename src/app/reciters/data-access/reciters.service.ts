import { Injectable, inject } from '@angular/core';
import { BACKEND_URL } from '../../core';
import { HttpClient } from '@angular/common/http';
import {
  combineLatest,
  combineLatestAll,
  filter,
  map,
  mergeScan,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { Reciter } from '../../core/model/reciter';
import { Surah } from '../../core/model/surah';

@Injectable()
export class RecitersService {
  #backendUrl = inject(BACKEND_URL);
  #httpClient = inject(HttpClient);

  getReciters() {
    return this.#backendUrl.recitersUrl$.pipe(
      switchMap((url) => this.#httpClient.get<{ reciters: Reciter[] }>(url))
    );
  }

  getSuraList() {
    return this.#httpClient
      .get<{ suwar: Surah[] }>('https://mp3quran.net/api/v3/suwar')
      .pipe(
        map(({ suwar }) =>
          suwar.map((surah) => ({
            id: surah.id.toString().padStart(3, '0'),
            name: surah.name,
            type: surah.makkia,
          }))
        )
      );
  }
}
