import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Moment } from 'moment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    imports: [MatDatepickerModule, ReactiveFormsModule, TranslateModule, MatFormFieldModule, MatInputModule],
})
export class DatepickerComponent {
    public control = input.required<FormControl>();
    public label = input.required<string>();
    public min = input<Date | Moment>();
    public max = input<Date | Moment>();
}
