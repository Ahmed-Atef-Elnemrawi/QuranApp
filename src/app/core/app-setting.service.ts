import { Injectable, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { BACKEND_URL } from ".";
import { Language } from "./model/language";
import { LocalStorageService } from "./storage.service";
import { AppSetting } from "./model/app-setting";

@Injectable()
export class AppSettingService implements AppSetting{
  #storage = inject(LocalStorageService);
  #backendUrlService = inject(BACKEND_URL)

  currentLanguage = signal<string>(this.#storage.selectLanguage());
  currentLanguage$ = toObservable(this.currentLanguage);

  isDarkMode = signal<boolean>(this.#storage.selectIsDarkMode());

  toggleMode = () =>{
    this.isDarkMode.update(value => {
      this.#storage.setDarkMode(!value)
      return !value
    });
  }

  changeLanguage = (lang: Language) => {
    this.currentLanguage.update((curr) => (curr = lang.language));
    this.#storage.setLanguage(lang.language);
    this.updateBackendUrlBasedOnLang(lang)
  };


  private updateBackendUrlBasedOnLang(lang: Language){
    this.#backendUrlService.updateRecitersUrl(lang.reciters);
    this.#backendUrlService.updateRadioUrl(lang.radios);
  }
}
