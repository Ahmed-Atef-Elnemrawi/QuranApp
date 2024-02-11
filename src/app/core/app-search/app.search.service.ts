import { Injectable, inject } from '@angular/core';
import { BACKEND_URL } from '..';
import { EMPTY, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Reciter } from '../model/reciter';

type data = { reciters: Reciter[] };

@Injectable()
export class AppSearchService {
  private backedUrl = inject(BACKEND_URL);
  private http = inject(HttpClient);

  private reciters$ = this.backedUrl.recitersUrl$.pipe(
    switchMap((url) => this.http.get<data>(url)),
    map(({ reciters }) => reciters)
  );

  search(keyword: string) {
    if (keyword) {
      keyword = keyword.toLocaleLowerCase().trim();

      return this.reciters$.pipe(
        map((data) =>
          data.filter((reciter) => {
            return reciter.name
              .toLocaleLowerCase()
              .split(' ')
              .some((name) => name.startsWith(keyword));
          })
        )
      );
    } else {
      return of([])
    }
  }
}
