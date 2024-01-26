import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'track-navigation',
  standalone: true,
  imports: [],
  template: `
    <div
      id="more-controllers"
      class="flex place-content-start place-items-center gap-x-5 lg:translate-y-0 rounded-none shadow-none"
    >
      <!-- previous button -->
      <button id="previous-btn" class="w-fit h-fit" (click)="onPrevious($event)">
        <svg
          class="fill-text w-4 h-4 sm:h-5 sm:w-5"
          viewBox="0 0 32 32"
          style="
          fill-rule: evenodd;
          clip-rule: evenodd;
          stroke-linejoin: round;
          stroke-miterlimit: 2;
        "
          version="1.1"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:serif="http://www.serif.com/"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g id="Icon">
            <path
              d="M9.441,13.504c-0.834,0.556 -1.335,1.493 -1.335,2.496c-0,1.003 0.501,1.94 1.335,2.496l13.895,9.263c0.92,0.614 2.104,0.671 3.08,0.149c0.975,-0.522 1.584,-1.539 1.584,-2.645l-0,-18.526c-0,-1.106 -0.609,-2.123 -1.584,-2.645c-0.976,-0.522 -2.16,-0.465 -3.08,0.149l-13.895,9.263Zm1.11,1.664l13.894,-9.263c0.307,-0.205 0.702,-0.224 1.027,-0.05c0.325,0.174 0.528,0.513 0.528,0.882c-0,0 -0,18.526 -0,18.526c-0,0.369 -0.203,0.708 -0.528,0.882c-0.325,0.174 -0.72,0.155 -1.027,-0.05c0,0 -13.894,-9.263 -13.894,-9.263c-0.278,-0.185 -0.445,-0.498 -0.445,-0.832c-0,-0.334 0.167,-0.647 0.445,-0.832Z"
            />

            <path
              d="M3.977,4.987l-0.003,22c0,0.552 0.448,1.001 1,1.001c0.552,-0 1,-0.448 1,-1l0.003,-22c0.001,-0.552 -0.447,-1 -0.999,-1c-0.552,-0 -1,0.448 -1.001,0.999Z"
            />
          </g>
        </svg>
      </button>

      <!-- music button -->
      <button disabled id="music-btn" class="w-fit h-fit hidden lg:block">
        <svg
          class="fill-text w-4 h-4 sm:h-5 sm:w-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22,3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V14.556A3.959,3.959,0,0,0,6,14a4,4,0,1,0,4,4V8H20v6.556A3.959,3.959,0,0,0,18,14a4,4,0,1,0,4,4ZM6,20a2,2,0,1,1,2-2A2,2,0,0,1,6,20ZM10,6V4H20V6Zm8,14a2,2,0,1,1,2-2A2,2,0,0,1,18,20Z"
          />
        </svg>
      </button>

      <div class="cursor-default">
        <p class="text-sm font-medium">{{ suraName }}</p>
        <p class="text-sm font-medium">{{ reciterName }}</p>
      </div>

      <button id="next-btn" class="w-fit h-fit" (click)="onNext($event)">
        <svg
          class="fill-text w-4 h-4 sm:h-5 sm:w-5"
          viewBox="0 0 32 32"
          style="
          fill-rule: evenodd;
          clip-rule: evenodd;
          stroke-linejoin: round;
          stroke-miterlimit: 2;
        "
          version="1.1"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:serif="http://www.serif.com/"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g id="Icon">
            <path
              d="M22.554,13.503c-3.552,-2.365 -10.056,-6.696 -13.914,-9.265c-0.921,-0.613 -2.104,-0.67 -3.079,-0.148c-0.975,0.522 -1.584,1.539 -1.584,2.645l0,18.53c0,1.106 0.609,2.123 1.584,2.645c0.975,0.522 2.158,0.465 3.079,-0.148c3.858,-2.569 10.362,-6.9 13.914,-9.265c0.836,-0.556 1.338,-1.493 1.338,-2.497c-0,-1.004 -0.502,-1.941 -1.338,-2.497l0,-0Zm-15.022,-7.601l13.914,9.266c0.278,0.185 0.446,0.497 0.446,0.832c-0,0.335 -0.168,0.647 -0.446,0.832l-13.914,9.266c-0.307,0.204 -0.702,0.223 -1.027,0.049c-0.325,-0.174 -0.528,-0.513 -0.528,-0.882c0,0 0,-18.53 0,-18.53c0,-0.369 0.203,-0.708 0.528,-0.882c0.325,-0.174 0.72,-0.155 1.027,0.049Z"
            />

            <path
              d="M26.003,4.987l-0.003,22c-0,0.552 0.448,1.001 1,1.001c0.552,-0 1,-0.448 1,-1l0.003,-22c-0,-0.552 -0.448,-1 -1,-1c-0.552,-0 -1,0.448 -1,0.999Z"
            />
          </g>
        </svg>
      </button>
    </div>
  `,
  styles: ``,
})
export class TrackNavigationComponent {
  @Input() reciterName = '';
  @Input() suraName = '';

  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  onNext($event: Event){
    $event.preventDefault();
    $event.stopPropagation();
    this.next.emit();
  }

  onPrevious($event: Event){
    $event.preventDefault();
    $event.stopPropagation();
    this.previous.emit()
  }
}
