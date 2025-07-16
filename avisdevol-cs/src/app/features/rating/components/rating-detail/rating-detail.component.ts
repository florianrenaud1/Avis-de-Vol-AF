import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
    MaterialModule,
    Rating,
    RatingService,
    NotificationService,
    RatingStatus,
    RATING_STATUS_OPTIONS,
    RatingStatusSelectComponent,
    AuthenticationService,
} from '@avisdevol-cs/shared';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@avisdevol-cs/shared';
import moment from 'moment';
import { catchError, shareReplay, Subject, switchMap, tap, merge, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-rating-detail',
    imports: [MaterialModule, TranslateModule, CommonModule, PageTitleComponent, ReactiveFormsModule, RatingStatusSelectComponent],
    templateUrl: './rating-detail.component.html',
    styleUrl: './rating-detail.component.scss',
})
export class RatingDetailComponent {
    private readonly _route = inject(ActivatedRoute);
    private readonly _router = inject(Router);
    private readonly _activatedRoute = inject(ActivatedRoute);
    private readonly _ratingService = inject(RatingService);
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _notificationService = inject(NotificationService);
    private readonly _authenticationService = inject(AuthenticationService);
    private readonly addAnswer$$: Subject<void> = new Subject<void>();
    private readonly updateStatus$$: Subject<RatingStatus> = new Subject<RatingStatus>();
    private readonly refreshData$$: Subject<void> = new Subject<void>();

    public readonly moment = moment;
    public readonly isLoading = signal(true);
    public readonly rating = signal<Rating | null>(null);
    public readonly statusOptions = RATING_STATUS_OPTIONS;

    // Formulaire pour la réponse
    public readonly answerForm: FormGroup = this._formBuilder.group({
        answer: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    });

    // Formulaire pour le changement de statut
    public readonly statusForm: FormGroup = this._formBuilder.group({
        status: ['', Validators.required],
    });

    public readonly ratings$ = merge(this.refreshData$$.pipe(startWith(null))).pipe(
        switchMap(() => this._ratingService.getOne(this._activatedRoute.snapshot.params['id'])),
        tap((rating: Rating) => {
            this.answerForm.controls['answer'].setValue(rating.answer || '');
            this.statusForm.controls['status'].setValue(rating.status || '');
        }),
        catchError(() => this._router.navigateByUrl('ratings').then(() => null)),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    public readonly updateStatus$ = this.updateStatus$$
        .pipe(
            switchMap((status: RatingStatus) =>
                this._ratingService.updateStatus(this._activatedRoute.snapshot.params['id'], status).pipe(
                    tap(() => {
                        this._notificationService.displaySuccess('COMMONS.RATING_DETAIL.NOTIFICATION.STATUS_UPDATED_SUCCESSFULLY');
                        this.refreshData$$.next();
                    })
                )
            ),
            takeUntilDestroyed()
        )
        .subscribe();

    public readonly addAnswer$ = this.addAnswer$$
        .pipe(
            switchMap(() =>
                this._ratingService.addAnswer(this._activatedRoute.snapshot.params['id'], this.answerForm.get('answer')?.value).pipe(
                    tap(() => {
                        this._notificationService.displaySuccess('COMMONS.RATING_DETAIL.NOTIFICATION.ANSWER_SUCCESS');
                        this.refreshData$$.next();
                    })
                )
            ),
            takeUntilDestroyed()
        )
        .subscribe();

    /**
     * Retourne à la liste des avis
     */
    public goBack(): void {
        this._router.navigate(['/avis']);
    }

    /**
     * Soumet la réponse à l'avis
     */
    public onSubmitAnswer(): void {
        if (this.answerForm.valid) {
            this.addAnswer$$.next();
        } else {
            this.answerForm.markAllAsTouched();
        }
    }

    /**
     * Met à jour le statut de l'avis
     */
    public onStatusChange(): void {
        if (this.statusForm.valid) {
            const newStatus = this.statusForm.get('status')?.value;
            if (newStatus) {
                this.updateStatus$$.next(newStatus);
            }
        }
    }

    /**
     * Récupère les informations d'affichage pour un statut
     */
    public getStatusDisplay(status: RatingStatus) {
        return (
            this.statusOptions.find(option => option.value === status) || {
                value: status,
                label: 'COMMONS.STATUS.UNKNOWN',
                color: 'text-gray-600',
                bgColor: 'bg-gray-100',
            }
        );
    }

    /**
     * Vérifie si une réponse existe déjà
     */
    public hasAnswer(rating: Rating): boolean {
        return !!(rating?.answer && rating.answer.trim().length > 0);
    }

    /**
     * Vérifie si l'utilisateur a les droits d'administration/modération
     */
    public hasManagementAccess(): boolean {
        return this._authenticationService.isAdminOrModerator();
    }

    /**
     * Obtient la couleur et l'icône selon la note
     */
    public getRatingDisplay(rating: number): { color: string; label: string; icon: string } {
        switch (rating) {
            case 5:
                return { color: 'text-green-600', label: 'Excellent', icon: 'sentiment_very_satisfied' };
            case 4:
                return { color: 'text-lime-600', label: 'Très bien', icon: 'sentiment_satisfied' };
            case 3:
                return { color: 'text-yellow-600', label: 'Correct', icon: 'sentiment_neutral' };
            case 2:
                return { color: 'text-orange-600', label: 'Décevant', icon: 'sentiment_dissatisfied' };
            case 1:
                return { color: 'text-red-600', label: 'Très décevant', icon: 'sentiment_very_dissatisfied' };
            default:
                return { color: 'text-gray-600', label: 'Non noté', icon: 'help_outline' };
        }
    }
}
