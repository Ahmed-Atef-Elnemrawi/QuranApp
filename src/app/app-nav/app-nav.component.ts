import { CommonModule } from "@angular/common";
import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { Utils } from "../shared/dom.utils";
import { APP_SETTING } from "../core";
import { Subscription, tap } from "rxjs";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ScaleAnimation } from "../shared/scale-animation.directive";
import { ClickAnimation } from "../shared/click-animation.directive";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ClickAnimation],
  template: `

   <div
    class="w-fit h-fit p-1.5 rounded-sm"
    >
      <button
        class="px-2 w-20 hover:opacity-65 font-medium"
        routerLink='reciters' routerLinkActive="active"
        >
        Reciters
      </button>
      <button
        class="px-2 py-1 w-20 hover:opacity-65 font-medium"
        >
        Radios
      </button>
   </div>
  `,
  styles: `
  .active{
    @apply text-accent opacity-100;
  }
  `
})
export class AppNavigation {

}
