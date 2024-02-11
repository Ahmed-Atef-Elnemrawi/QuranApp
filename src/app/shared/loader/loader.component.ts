import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: 'loader',
  standalone: true,
  imports: [CommonModule],
  template: `
  <span class="loader text-text"></span>
  `,
  styles: `
  .loader,
  .loader:before,
  .loader:before,
  .loader:after {
    width: 1.8em;
    height: 1.8em;
    border-radius:2px;
    animation-fill-mode: both;
    animation: bblFadInOut 1.8s infinite ease-in-out;
  }

  .loader {
    font-size: 6px;
    position: relative;
    text-indent: -9999em;
    transform: translateZ(0);
    animation-delay: -0.16s;
  }

  .loader:before,
  .loader:after {
    content: '';
    position: absolute;
    top: 0;
  }

  .loader:before {
    left: -3.5em;
    animation-delay: -0.32s;
  }

  .loader:after {
    left: 3.5em;
  }

  @keyframes bblFadInOut {
    0%, 80%, 100% { box-shadow: 0 2.5em 0 -1.3em }
    40% { box-shadow: 0 2.5em 0 0 }
  }

  :host{
    @apply flex place-items-center place-content-center left-1/2 -translate-x-1/2 absolute -translate-y-1/2 top-1/2
  }
  `
})
export class LoaderComponent {

}
