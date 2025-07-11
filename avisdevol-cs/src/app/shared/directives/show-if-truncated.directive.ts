import { Directive, ElementRef, HostListener } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({ selector: '[matTooltip][appShowIfTruncated]' })
export class ShowIfTruncatedDirective {
    public constructor(
        private _matTooltip: MatTooltip,
        private _elementRef: ElementRef<HTMLElement>
    ) {}

    @HostListener('mouseenter', ['$event'])
    public setTooltipState(): void {
        const element = this._elementRef.nativeElement;
        this._matTooltip.disabled = element.scrollWidth <= element.clientWidth;
    }
}
