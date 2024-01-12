import { Injectable, signal } from "@angular/core";

@Injectable()
export class BackendUrlService{
  readonly rootUrl = 'https://www.mp3quran.net/api/v3'
  readonly languageUrl = 'https://www.mp3quran.net/api/v3/languages'

  recitersUrl = signal('');
  radiosUrl = signal('');

  updateRecitersUrl(value: string){
    this.recitersUrl.update(url => url = value);
  }

  updateRadioUrl(value: string){
    this.radiosUrl.update(url => url = value);
  }
}
