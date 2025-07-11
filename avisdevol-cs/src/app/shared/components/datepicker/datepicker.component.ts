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
    public readonly control = input.required<FormControl>();
    public readonly label = input.required<string>();
    public readonly min = input<Date | Moment>();
    public readonly max = input<Date | Moment>();
}
