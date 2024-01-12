import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'mode',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isDarkMode) {
    <button (click)="onModeChange()">
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        class="fill-text"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.23129 2.24048C9.24338 1.78695 10.1202 2.81145 9.80357 3.70098C8.72924 6.71928 9.38932 10.1474 11.6193 12.3765C13.8606 14.617 17.3114 15.2755 20.3395 14.1819C21.2206 13.8637 22.2173 14.7319 21.7817 15.7199C21.7688 15.7491 21.7558 15.7782 21.7427 15.8074C20.9674 17.5266 19.7272 19.1434 18.1227 20.2274C16.4125 21.3828 14.3957 22.0001 12.3316 22.0001H12.3306C9.93035 21.9975 7.6057 21.1603 5.75517 19.6321C3.90463 18.1039 2.64345 15.9797 2.18793 13.6237C1.73241 11.2677 2.11094 8.82672 3.2586 6.71917C4.34658 4.72121 6.17608 3.16858 8.20153 2.25386L8.23129 2.24048Z"
          ></path>
        </g>
      </svg>
    </button>
    }@else{
    <button (click)="onModeChange()">
      <svg
        width="24px"
        height="24px"
        class="stroke-text fill-text"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>

        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>

        <g id="SVGRepo_iconCarrier">
          <defs>
            <clipPath id="clip0_429_11039">
              <rect width="24" height="24" fill="white"></rect>
            </clipPath>
          </defs>

          <!-- Icon Content -->
          <g clip-path="url(#clip0_429_11039)">
            <circle
              cx="12"
              cy="12"
              r="4"
              stroke-width="2.5"
              stroke-linejoin="round"
            ></circle>
            <path
              d="M20 12H21"
              stroke-width="2.5"
              stroke-linecap="round"
            ></path>
            <path d="M3 12H4" stroke-width="2.5" stroke-linecap="round"></path>
            <path
              d="M12 20L12 21"
              stroke-width="2.5"
              stroke-linecap="round"
            ></path>
            <path
              d="M12 3L12 4"
              stroke-width="2.5"
              stroke-linecap="round"
            ></path>
            <path
              d="M17.6569 17.6569L18.364 18.364"
              stroke-width="2.5"
              stroke-linecap="round"
            ></path>
            <path
              d="M5.63605 5.63604L6.34315 6.34315"
              stroke-width="2.5"
              stroke-linecap="round"
            ></path>
            <path
              d="M6.34314 17.6569L5.63603 18.364"
              stroke-width="2.5"
              stroke-linecap="round"
            ></path>
            <path
              d="M18.364 5.63604L17.6568 6.34315"
              stroke="#292929"
              stroke-width="2.5"
              stroke-linecap="round"
            ></path>
          </g>
        </g>
      </svg>
    </button>
    }
  `,
})
export class ModeComponent {
  @Output() modeChanged = new EventEmitter();
  @Input() isDarkMode = false;

  onModeChange() {
    this.modeChanged.emit();
  }
}
