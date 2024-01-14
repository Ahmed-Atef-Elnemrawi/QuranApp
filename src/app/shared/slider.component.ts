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
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'range-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-0.5 relative bg-accent rounded-sm my-1" #rangeContainer>
      <div
        class="bg- absolute top-0 left-0 h-0.5 bg-text"
        #skippedTracker
      ></div>
      <div
        class="size-2.5 bg-text absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rounded-sm shadow-lg"
        #rangeThumb
      ></div>
    </div>
  `,
  styles: [
    `
      :host {
        box-sizing: border-box;
        width: max-content;
        height: fit-content;
        display: inline-block;
      }
    `,
  ],
})
export class SliderComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('rangeContainer', { static: true }) rangeContainer!: ElementRef;
  @ViewChild('rangeThumb', { static: true }) rangeThumb!: ElementRef;
  @ViewChild('skippedTracker', { static: true }) skippedTracker!: ElementRef;

  @Input() width: string = '50px';
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Output() mouseMove = new EventEmitter<number>();

  private isDragging = false;
  private containerRect!: DOMRect;
  private thumbRect!: DOMRect;
  private maxThumbPosition!: number;
  private currentThumbPosition!: number;

  private onChange: any = () => {};
  private onTouch: any = () => {};
  private value: number = 0;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.setupInitialView();
  }

  private setupInitialView(): void {
    this.setStyle(this.rangeContainer.nativeElement, { width: this.width });
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
    this.containerRect =
      this.rangeContainer.nativeElement.getBoundingClientRect();
    this.thumbRect = this.rangeThumb.nativeElement.getBoundingClientRect();
    this.updateMaxThumbPosition();
    this.currentThumbPosition = event.clientX - this.containerRect.left;
    this.updateThumbAndTrackerPositions(this.currentThumbPosition);
  }

  private updateThumbAndTrackerPositions(position: number): void {
    position = this.snapToStep(position);
    const totalWidth = this.containerRect.width - this.thumbRect.width;
    const percentage = (position / totalWidth) * 100;
    this.setStyle(this.rangeThumb.nativeElement, { left: `${percentage}%` });
    this.setStyle(this.skippedTracker.nativeElement, {
      width: `${percentage}%`,
    });
    this.updateValueAndNotify(position, totalWidth);
  }

  private updateValueAndNotify(position: number, totalWidth: number): void {
    const calculatedValue = ((position / totalWidth) * this.max).toFixed(2);
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
      this.currentThumbPosition = event.clientX - this.containerRect.left;
      this.updateThumbAndTrackerPositions(this.currentThumbPosition);
      this.mouseMove.emit(this.value);
    }
  }

  private handleMouseUp(): void {
    this.isDragging = false;
  }

  private updateMaxThumbPosition(): void {
    if (this.rangeThumb && this.rangeContainer) {
      this.maxThumbPosition = this.containerRect.width - this.thumbRect.width;
    }
  }

  private snapToStep(position: number): number {
    const steps = this.max / this.step;
    const stepWidth = this.maxThumbPosition / steps;
    const steppedPosition = Math.fround(position / stepWidth) * stepWidth;
    const snappedPosition = Math.min(steps * stepWidth, steppedPosition);

    return Math.max(0, snappedPosition);
  }

  writeValue(value: number): void {
    this.value = value;
    if (this.containerRect && this.thumbRect) {
      const totalWidth = this.containerRect.width - this.thumbRect.width;
      const position = (value * totalWidth) / this.max;
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
