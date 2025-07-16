import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, of } from 'rxjs';

import { AbstractAutocompleteComponent } from '../abstract-autocomplete.component';
import { ShowIfTruncatedDirective } from '../../../directives';
import { TranslateModule } from '@ngx-translate/core';
import { AirlineService } from '../../../services';
import { Airline } from '../../../models';

@Component({
    imports: [
        CommonModule,
        MatAutocompleteModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        ReactiveFormsModule,
        ShowIfTruncatedDirective,
        TranslateModule,
    ],
    selector: 'app-airline-autocomplete',
    templateUrl: './airline-autocomplete.component.html',
})
export class AirlineAutocompleteComponent extends AbstractAutocompleteComponent<Airline> {
    // Dependency injection.
    private readonly _airlineService = inject(AirlineService);

    // Inputs.
    public readonly label = input<string>('COMMONS.PROPERTY.AIRLINE');

    // Observables.
    public airlines$ = computed(() =>
        this.valueChanges((value: string | Airline) =>
            typeof value === 'string' && value.length > 1
                ? this._airlineService.getAirlinesByName(value.trim()).pipe(catchError(() => of([])))
                : of([])
        )
    );

    // Methods.
    protected override getFormatControlFieldName(): string {
        return 'airline';
    }

    /**
     * Display function for mat-autocomplete to show airline name
     * @param airline The airline object or string
     * @returns The airline name to display
     */
    public displayAirline = (airline: Airline | string): string => {
        if (airline && typeof airline === 'object') {
            return airline.name || '';
        }
        return airline ?? '';
    };
}
