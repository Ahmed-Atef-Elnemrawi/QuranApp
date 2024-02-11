import {
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { animate } from 'motion';

@Directive({
  selector: '[animate-click]',
  standalone: true,
})
export class ClickAnimation implements OnInit {
  #el = inject(ElementRef);
  #renderer = inject(Renderer2);

  ngOnInit(): void {
    if (this.#el.nativeElement instanceof HTMLButtonElement) {
      this.#renderer.listen(this.#el.nativeElement, 'click', () => {
        animate(
          this.#el.nativeElement,
          {
            scale: [0.85, 1],
          },
          {
            duration: 0.2,
            easing: [0.65, 0, 0.35, 1],
          }
        );
      });
    }
  }
}
