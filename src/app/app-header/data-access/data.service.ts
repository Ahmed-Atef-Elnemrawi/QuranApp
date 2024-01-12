import {
  Injectable,
  Injector,
  inject,
  runInInjectionContext,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BACKEND_URL } from '../../core';

export interface Language {
  language: string;
  native: string;
  reciters: string;
  radios: string;
}

@Injectable()
export class DataService {
  #injector = inject(Injector);
  #url = inject(BACKEND_URL);
  #http = inject(HttpClient);

  getLanguage$() {
    return this.#http.get<{ language: Language[] }>(this.#url.languageUrl);
  }

  getLanguage() {
    return runInInjectionContext(this.#injector, () => {
      return toSignal(
        this.getLanguage$().pipe(
          map((val) => val.language.slice(0,2)),
        )
      );
    });
  }
}
