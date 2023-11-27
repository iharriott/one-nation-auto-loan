import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appPinIconHoover]',
})
export class PinIconHooverDirective implements OnInit {
  @Input() mouseEnter = 'transparent';
  @Input() mouseLeave = 'blue';
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    this.renderer.setAttribute(
      this.elRef.nativeElement,
      'class',
      this.mouseLeave
    );
  }

  @HostListener('mouseenter') mouseover(eventData: Event) {
    this.renderer.setAttribute(
      this.elRef.nativeElement,
      'class',
      this.mouseEnter
    );
  }

  @HostListener('mouseleave') mouseleave(eventData: Event) {
    this.renderer.setAttribute(
      this.elRef.nativeElement,
      'class',
      this.mouseLeave
    );
  }
}
