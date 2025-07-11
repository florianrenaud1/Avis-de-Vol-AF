import { Directive, input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive()
export abstract class AbstractFieldComponent {
    // Inputs.
    public readonly control = input.required<FormControl>();
    public readonly label = input<string>('');
}
