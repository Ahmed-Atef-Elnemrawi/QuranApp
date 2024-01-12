import { Signal } from "@angular/core"
import { Language } from "./model/language";

export interface AppSetting{
  currentLanguage:Signal<string>
  isDarkMode:Signal<boolean>
  toggleMode:() => void;
  changeLanguage:(lang: Language) => void;
}
