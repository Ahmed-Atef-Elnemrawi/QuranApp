import { ElementRef, Renderer2, inject } from '@angular/core';
import {isString} from 'lodash'

export class Utils {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  addClass(el: any, className: string | string[]): Utils {
    if (isString(className)) {
      this.renderer.addClass(el, className);
    } else {
      className.forEach((c) => this.renderer.addClass(el, c));
    }
    return this;
  }

  removeClass(el: any, className: string | string[]): Utils {
    if (isString(className)) {
      this.renderer.removeClass(el, className);
    } else {
      className.forEach((c) => this.renderer.removeClass(el, c));
    }
    return this;
  }

  queryById(id: string): HTMLElement | null {
    return this.el.nativeElement.querySelector(`#${id}`);
  }

  queryAllById(id: string): any{
    return this.el.nativeElement.querySelectorAll(`#${id}`)
  }

  queryByClass(className: string): HTMLElement | null {
    return this.el.nativeElement.querySelector(`.${className}`);
  }

  queryByTag(tagName: string): HTMLElement | null {
    return this.el.nativeElement.querySelector(tagName);
  }

  listenTo(
    el: HTMLElement,
    eventName: string,
    callback: (event: any) => boolean | void
  ): void {
    this.renderer.listen(el, eventName, callback);
  }

  setStyle(element: any, styles: { [key: string]: any }): Utils {
    Object.entries(styles).forEach(([property, value]) =>
      this.renderer.setStyle(element, property, value)
    );
    return this;
  }

  removeStyle(element: any, styles: string | string[]): Utils {
    if (isString(styles)) {
      this.renderer.removeStyle(element, styles);
    } else {
      styles.forEach((style) => this.renderer.removeStyle(element, style));
    }
    return this;
  }

  addAttribute(element: any, name: string, value: string): Utils {
    this.renderer.setAttribute(element, name, value);
    return this;
  }

  removeAttribute(element: any, name: string): Utils {
    this.renderer.removeAttribute(element, name);
    return this;
  }

  getHostEl(): HTMLElement {
    return this.el.nativeElement as HTMLElement;
  }
}
