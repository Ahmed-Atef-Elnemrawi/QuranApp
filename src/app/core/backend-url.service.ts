import { Injectable, signal } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class BackendUrlService{
  readonly rootUrl = 'https://www.mp3quran.net/api/v3'
  readonly languageUrl = 'https://www.mp3quran.net/api/v3/languages'
  readonly #defaultRecitersUrl =
  'https://www.mp3quran.net/api/v3/reciters?language=eng';
readonly #defaultRadiosUrl =
  'https://www.mp3quran.net/api/v3/radios?language=eng';

  #recitersUrlSub$ = new BehaviorSubject(this.#defaultRecitersUrl);
  #radiosUrlSub$ = new BehaviorSubject(this.#defaultRadiosUrl);

  recitersUrl$ = this.#recitersUrlSub$.asObservable();
  radiosUrl$ = this.#radiosUrlSub$.asObservable();

  updateRecitersUrl(value: string){
    this.#recitersUrlSub$.next(value);
  }

  updateRadioUrl(value: string){
    this.#radiosUrlSub$.next(value);
  }
}
