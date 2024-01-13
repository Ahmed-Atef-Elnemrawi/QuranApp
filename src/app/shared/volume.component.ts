import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'volume-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VolumeComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-10 h-fit px-3.5 flex flex-col place-content-center place-items-center gap-2 py-4 rounded-sm shadow-sm bg-primary box-border">
      <p class=" text-center text-sm/none font-medium opacity-75">{{value}}</p>
      <div class="w-0.5 relative bg-accent rounded-sm mx-1" #tracker>
        <div class="absolute bottom-0 right-0 w-0.5 bg-text" #skippedTracker></div>
        <div
          class="size-2.5 bg-accent absolute right-1/2 bottom-0 translate-x-1/2 translate-y-1/2 rounded-sm shadow-lg"
          #thumb
        ></div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        box-sizing: border-box;
        width: max-content;
        height: fit-content;
      }
    `,
  ],
})
export class VolumeComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('tracker', { static: true }) tracker!: ElementRef;
  @ViewChild('thumb', { static: true }) thumb!: ElementRef;
  @ViewChild('skippedTracker', { static: true }) skippedTracker!: ElementRef;

  @Input() height: string = '100px';
  @Input() max: number = 100;
  @Input() step: number = 1;

  private isDragging = false;
  private containerRect!: DOMRect;
  private thumbRect!: DOMRect;
  private maxThumbPosition!: number;
  private currentThumbPosition!: number;

  private onChange: any = () => {};
  private onTouch: any = () => {};
   value: number = 0;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.setupInitialView();
  }

  private setupInitialView(): void {
    this.setStyle(this.tracker.nativeElement, { height: this.height });
    this.containerRect = this.tracker.nativeElement.getBoundingClientRect();
    this.thumbRect = this.thumb.nativeElement.getBoundingClientRect();
    this.updateMaxThumbPosition();
  }

  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.startDragging(event);
    this.registerMouseMoveListener();
    this.registerMouseUpListener();
  }

  private startDragging(event: MouseEvent): void {
    this.isDragging = true;
    this.containerRect = this.tracker.nativeElement.getBoundingClientRect();
    this.thumbRect = this.thumb.nativeElement.getBoundingClientRect();
    // this.updateMaxThumbPosition();
    this.currentThumbPosition = this.containerRect.bottom - event.y;
    this.updateThumbAndTrackerPositions(this.currentThumbPosition);
  }

  private updateThumbAndTrackerPositions(position: number): void {
    position = this.snapToStep(position);
    const totalHeight = this.containerRect.height - this.thumbRect.height;
    const percentage = (position / totalHeight) * 100;
    this.setStyle(this.thumb.nativeElement, { bottom: `${percentage}%` });
    this.setStyle(this.skippedTracker.nativeElement, { height: `${percentage}%` });
    this.updateValueAndNotify(position, totalHeight);
  }

  private updateValueAndNotify(position: number, totalHeight: number): void {
    const calculatedValue = ((position / totalHeight) * this.max).toFixed();
    this.value = +calculatedValue;
    this.onChange(this.value);
    this.onTouch();
  }

  private registerMouseMoveListener(): void {
    this.renderer.listen(
      'document',
      'mousemove',
      this.handleMouseMove.bind(this)
    );
  }

  private registerMouseUpListener(): void {
    this.renderer.listen('document', 'mouseup', this.handleMouseUp.bind(this));
  }

  private handleMouseMove(event: MouseEvent): void {
    event.preventDefault();
    if (this.isDragging) {
      this.currentThumbPosition = this.containerRect.bottom - event.y;
      this.updateThumbAndTrackerPositions(this.currentThumbPosition);
    }
  }

  private handleMouseUp(): void {
    this.isDragging = false;
  }

  private updateMaxThumbPosition(): void {
    if (this.thumb && this.tracker) {
      this.maxThumbPosition = this.containerRect.height - this.thumbRect.height;
    }
  }

  private snapToStep(position: number): number {
    const steps = this.max / this.step;
    const stepHeight = this.maxThumbPosition / steps;
    const steppedPosition = Math.round(position / stepHeight) * stepHeight;
    const snappedPosition = Math.min(steps * stepHeight, steppedPosition);

    return Math.max(0, snappedPosition);
  }

  writeValue(value: number): void {
    this.value = value;
    if (this.containerRect && this.thumbRect) {
      const totalHeight = this.containerRect.height - this.thumbRect.height;
      const position = (value * totalHeight) / this.max;
      this.updateThumbAndTrackerPositions(position);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  private setStyle(element: any, styles: { [key: string]: any }): void {
    Object.entries(styles).forEach(([property, value]) =>
      this.renderer.setStyle(element, property, value)
    );
  }
}
