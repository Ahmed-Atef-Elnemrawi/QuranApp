import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PlayerComponent } from '../player/feature/player.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, PlayerComponent],
  template: `
    <div
      class="w-dvw h-fit bg-container flex flex-col place-content-start place-items-center sm:py-3.5 md:py-2.5"
    >
      <app-player />
    </div>
  `,
  styles: `
  :host{
    z-index:40;
  }
`,
})
export class AppFooterComponent { }
