import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RATING_STATUS_OPTIONS } from '../../enums/rating-status.enum';

@Component({
    selector: 'app-rating-status-select',
    imports: [MaterialModule, TranslateModule, CommonModule, ReactiveFormsModule],
    templateUrl: './rating-status-select.component.html',
})
export class RatingStatusSelectComponent {
    public readonly control = input.required<AbstractControl>();
    public readonly label = input.required<string>();
    public readonly placeholder = input<string>('');

    public readonly statusOptions = RATING_STATUS_OPTIONS;
}
