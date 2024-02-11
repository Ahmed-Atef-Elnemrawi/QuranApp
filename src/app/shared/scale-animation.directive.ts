import {
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { animate, spring } from 'motion';

@Directive({
  selector: '[animate-scale]',
  standalone: true,
})
export class ScaleAnimation implements OnInit {
  #renderer = inject(Renderer2);
  #el = inject(ElementRef);

  ngOnInit(): void {
    this.#renderer.listen(this.#el.nativeElement, 'mouseenter', (e) => {
      this.animateButton();
    });
  }

  animateButton() {
    const element = this.#el.nativeElement as HTMLElement;
    animate(
      element,
      {
        scaleX: [1.02, 1],
      },
      { duration: 1, easing: spring({ stiffness: 400, damping: 300, mass: 5 }) }
    );
  }
}
