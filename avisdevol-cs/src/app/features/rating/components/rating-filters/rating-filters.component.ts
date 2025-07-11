import { Component, input, inject, effect } from '@angular/core';
import {
    MaterialModule,
    DateRangeSummaryComponent,
    DatepickerComponent,
    TruncatePipe,
    AirlineAutocompleteComponent,
    YesNoSelectComponent,
    RatingStatusSelectComponent,
    RatingStatus,
    RATING_STATUS_OPTIONS,
} from '@avisdevol-cs/shared';
import { RatingFilters } from '../../../../shared/models';
import { Store } from '@ngrx/store';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, shareReplay, startWith, Subject, tap } from 'rxjs';
import { RatingActions } from '../../../../core/states/actions';
import { App, LayoutActions, RatingForm } from '@avisdevol-cs/core';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-rating-filters',
    imports: [
        MaterialModule,
        DateRangeSummaryComponent,
        TranslateModule,
        DatepickerComponent,
        CommonModule,
        ReactiveFormsModule,
        MatExpansionModule,
        TruncatePipe,
        AirlineAutocompleteComponent,
        YesNoSelectComponent,
        RatingStatusSelectComponent,
    ],
    templateUrl: './rating-filters.component.html',
    styleUrl: './rating-filters.component.scss',
})
export class RatingFiltersComponent {
    // Inputs.
    private readonly _store = inject(Store<App.State>);
    private readonly _formBuilder = inject(FormBuilder);

    public readonly filters = input<RatingFilters>();
    public readonly moment = moment;

    public readonly searchRatingsForm = this._formBuilder.group({
        airline: [''],
        flightNumber: [''],
        startDate: [''],
        endDate: [''],
        answered: [''],
        status: [''],
    }) as FormGroup & { controls: { [K in keyof RatingFilters]: AbstractControl } };

    public readonly isAskingFilteredRatings$$: Subject<RatingFilters> = new Subject<RatingFilters>();
    public readonly search$: Observable<RatingFilters> = this.isAskingFilteredRatings$$.pipe(
        tap((ratingFilters: RatingFilters) => {
            console.log('Search initiated with filters:', ratingFilters);
            this._store.dispatch(RatingActions.search(ratingFilters));
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
        startWith(RatingForm.initialState.ratingFiltersForm)
    );

    public constructor() {
        // Setting up effect for filters
        effect(() => {
            if (this.filters()) {
                this.searchRatingsForm.patchValue(this.filters() as RatingFilters);
            }
        });
    }

    public clearField(attributeField: string): void {
        this.searchRatingsForm.get(attributeField)?.reset();
    }

    public clearForm(): void {
        this._store.dispatch(LayoutActions.ResetFilters());
        this.searchRatingsForm.reset(RatingForm.initialState.ratingFiltersForm);
    }

    /**
     * Récupère le label du statut
     */
    public getStatusLabel(status: RatingStatus): string {
        const option = RATING_STATUS_OPTIONS.find(opt => opt.value === status);
        return option ? option.label : 'COMMONS.STATUS.UNKNOWN';
    }
}
