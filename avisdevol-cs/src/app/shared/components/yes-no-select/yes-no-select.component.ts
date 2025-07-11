import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { BooleanDisplayPipe } from '../../pipes';

@Component({
    selector: 'app-yes-no-select',
    imports: [MatSelectModule, CommonModule, TranslateModule, MatFormFieldModule, ReactiveFormsModule, BooleanDisplayPipe],
    templateUrl: './yes-no-select.component.html',
})
export class YesNoSelectComponent {
    public readonly label = input<string>();
    public readonly control = input.required<FormControl>();
    public readonly allowBlankOption = input<boolean>(true);
}
