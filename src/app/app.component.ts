import { Component, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './app-header/app-header.component';
import { APP_SETTING } from './core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppHeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  #appSetting = inject(APP_SETTING);
  title = 'QuranApp';

  @HostBinding('class.dark') get isDarkMode(){
    return this.#appSetting.isDarkMode()
  }
}
