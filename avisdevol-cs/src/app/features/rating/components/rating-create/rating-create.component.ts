import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule, NotificationService, RatingForCreation, RatingService } from '@avisdevol-cs/shared';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@avisdevol-cs/shared';
import { DatepickerComponent } from '@avisdevol-cs/shared';
import { AirlineAutocompleteComponent } from '@avisdevol-cs/shared';
import moment from 'moment';
import { forkJoin, Observable, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-rating-create',
    imports: [
        MaterialModule,
        TranslateModule,
        CommonModule,
        ReactiveFormsModule,
        PageTitleComponent,
        DatepickerComponent,
        AirlineAutocompleteComponent,
    ],
    templateUrl: './rating-create.component.html',
    styleUrl: './rating-create.component.scss',
})
export class RatingCreateComponent {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _router = inject(Router);
    private readonly _ratingService = inject(RatingService);
    private readonly _notificationService = inject(NotificationService);

    public readonly moment = moment;
    public readonly isSubmitting = signal(false);
    public readonly submitCreateRating$$ = new Subject<RatingForCreation>();

    public readonly createRating$: Observable<RatingForCreation> = this.submitCreateRating$$.pipe(
        switchMap((rating: RatingForCreation) => {
            console.log('Creating rating:', rating);
            return this._ratingService.createRating(rating);
        })
    );

    /**
     * Side effects to subscribe events.
     */
    private readonly _sideEffects$ = forkJoin({
        success$: this.createRating$.pipe(
            tap(() => {
                this._router.navigate(['/avis']);
                this._notificationService.displaySuccess('COMMONS.NOTIFICATION.CREATE_SUCCESS');
            })
        ),
    });

    constructor() {
        this._sideEffects$.pipe(takeUntilDestroyed()).subscribe();
    }

    // Form group pour la création d'avis
    public readonly ratingForm: FormGroup = this._formBuilder.group({
        flightNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}\d{1,4}$/)]],
        date: ['', Validators.required],
        airline: ['', Validators.required],
        rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
        comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });

    // Options de notation
    public readonly ratingOptions = [
        { value: 5, label: 'Excellent (5/5)', color: 'text-green-600' },
        { value: 4, label: 'Très bien (4/5)', color: 'text-lime-600' },
        { value: 3, label: 'Correct (3/5)', color: 'text-yellow-600' },
        { value: 2, label: 'Décevant (2/5)', color: 'text-orange-600' },
        { value: 1, label: 'Très décevant (1/5)', color: 'text-red-600' },
    ];

    /**
     * Récupère le label correspondant à une note
     */
    public getRatingLabel(rating: number): string {
        const option = this.ratingOptions.find(opt => opt.value === rating);
        return option ? option.label : '';
    }

    /**
     * Soumet le formulaire de création d'avis
     */
    public onSubmit(): void {
        if (this.ratingForm.valid && !this.isSubmitting()) {
            this.isSubmitting.set(true);

            // Récupérer les valeurs du formulaire
            const formValues = this.ratingForm.value;

            const newRating: RatingForCreation = {
                flightNumber: formValues.flightNumber,
                date: formValues.date ? new Date(formValues.date) : new Date(),
                airline: formValues.airline,
                rating: Number(formValues.rating),
                comments: formValues.comment,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            console.log('Données du formulaire:', formValues);
            console.log('Objet Rating créé:', newRating);

            this.submitCreateRating$$.next(newRating);
        } else {
            this.ratingForm.markAllAsTouched();
        }
    }

    /**
     * Annule la création et retourne à la liste
     */
    public onCancel(): void {
        this._router.navigate(['/avis']);
    }
}
