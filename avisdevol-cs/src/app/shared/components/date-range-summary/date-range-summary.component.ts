import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
    selector: 'app-date-range-summary',
    templateUrl: './date-range-summary.component.html',
    imports: [DateFormatPipe, CommonModule, TranslateModule],
})
export class DateRangeSummaryComponent {
    public readonly label = input<string>();
    public readonly startDate = input<FormControl>();
    public readonly endDate = input<FormControl>();
}
