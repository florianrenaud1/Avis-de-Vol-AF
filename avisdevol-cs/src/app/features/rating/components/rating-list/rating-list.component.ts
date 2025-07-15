import { Component, inject, OnInit, AfterViewInit } from '@angular/core';

import { RatingFiltersComponent } from '../rating-filters/rating-filters.component';
import {
    AbstractListComponent,
    DataLoaderCallback,
    MaterialModule,
    Pageable,
    PageTitleComponent,
    Rating,
    RatingFilters,
    Airline,
    RatingStatus,
    RATING_STATUS_OPTIONS,
} from '@avisdevol-cs/shared';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { App, RatingForm } from '@avisdevol-cs/core';
import { select } from '@ngrx/store';
import moment from 'moment';
import { Subject, Observable, combineLatest, distinctUntilChanged, map, tap, shareReplay } from 'rxjs';
import { trimAndCleanObject } from '../../../../shared/helpers';
import { RatingService } from '../../../../shared/services/http/rating.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-rating-list',
    imports: [
        RatingFiltersComponent,
        PageTitleComponent,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatPaginator,
        MatTableModule,
        MatTooltip,
        MatSelectModule,
        MatFormFieldModule,
        MaterialModule,
        PageTitleComponent,
        ReactiveFormsModule,
        RouterLink,
        TranslateModule,
    ],
    templateUrl: './rating-list.component.html',
    styleUrl: './rating-list.component.scss',
})
export class RatingListComponent extends AbstractListComponent<Rating, RatingFilters> implements OnInit, AfterViewInit {
    // Dependency injection.
    private readonly _ratingService = inject(RatingService);

    // Observables.
    public readonly forceSearch$$ = new Subject<void>();
    public readonly filters$: Observable<RatingFilters> = combineLatest([
        this.store.pipe(select(App.getRatingFormFiltersState), distinctUntilChanged()),
        this.forceSearch$$,
    ]).pipe(
        map((results: [RatingFilters, void]) => results[0]),
        tap((ratingFilters: RatingFilters) => {
            this.dataSource.loadData(ratingFilters, true);
        }),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    // Template accesses.
    public moment = moment;
    public readonly statusOptions = RATING_STATUS_OPTIONS;

    // Propriétés pour le tri mobile
    public currentSortColumn: string = 'createdAt'; // Valeur par défaut qui correspond au tri initial de la table
    public currentSortDirection: 'asc' | 'desc' = 'desc';

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
     * Gère le changement de tri sur mobile
     */
    public onMobileSortChange(): void {
        this.applySortToDataSource();
    }

    /**
     * Bascule la direction du tri sur mobile
     */
    public toggleSortDirection(): void {
        this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
        this.applySortToDataSource();
    }

    /**
     * Applique le tri actuel au dataSource
     */
    private applySortToDataSource(): void {
        // Met à jour le sort de Material pour refléter le tri mobile
        if (this.sort()) {
            const matSort = this.sort()!;
            matSort.active = this.currentSortColumn;
            matSort.direction = this.currentSortDirection;
            
            // Déclenche le rechargement des données avec les nouveaux paramètres de tri
            this.forceSearch$$.next();
        }
    }

    /**
     * Constructor for the PersonalAccountsListComponent.
     * Initializes the displayed columns for the data table.
     */
    public constructor() {
        super();
        this.displayedColumns = ['rating', 'flightNumber', 'createdAt', 'airline', 'status', 'answered', 'action'];
    }

    /**
     * Initialize the data source with the company loader and filters.
     * This method is called when the component is initialized.
     */
    public ngOnInit(): void {
        this.initDatasource(this._personalAccountLoader, this.filters$);
        this.forceSearch$$.next();
    }

    /**
     * Called after the view has been initialized.
     * Synchronizes mobile sorting with Material table sorting.
     */
    public ngAfterViewInit(): void {
        // Synchronise le tri mobile avec le tri de la table Material

            if (this.sort()) {
                const matSort = this.sort()!;
                if (matSort.active) {
                    this.currentSortColumn = matSort.active;
                    this.currentSortDirection = (matSort.direction as 'asc' | 'desc') || 'asc';
                }
            }

    }

    /**
     * Data loader callback for loading personal accounts.
     * This method is used to fetch personal accounts based on the provided filters, pagination, and sorting options.
     * @param filters The filters to apply when searching for personal accounts.
     * @param pageIndex The index of the page to retrieve.
     * @param pageSize The number of items per page.
     * @param sortCol The column to sort by.
     * @param sortDirection The direction of the sort (ascending or descending).
     * @returns An observable that emits a pageable list of personal accounts.
     */
    private _personalAccountLoader: DataLoaderCallback<Rating, RatingFilters> = (
        filters: RatingFilters,
        pageIndex: number,
        pageSize: number,
        sortCol: string,
        sortDirection: string
    ): Observable<Pageable<Rating>> => this._ratingService.search(this._computeFilters(filters), pageIndex, pageSize, sortCol, sortDirection);

    /**
     * Compute additional filter fields and clean not needed empty values.
     * @param formFields Filter fields
     * @returns Cleaned filter values
     */
    private _computeFilters(personalAccountFiltersForm: RatingFilters): Partial<RatingFilters> {
        const formFields = { ...(personalAccountFiltersForm ?? RatingForm.initialState.ratingFiltersForm) };

        // Extract airline name if it's an object, or keep as string if it's free text
        let airline: string | undefined;
        if (formFields.airline) {
            if (typeof formFields.airline === 'string') {
                airline = formFields.airline.trim();
            } else if (typeof formFields.airline === 'object') {
                // Check if it's an Airline object with name property
                if ('name' in formFields.airline) {
                    airline = (formFields.airline as Airline).name;
                }
                // Check if it's a free text object with airline property
                else if ('airline' in formFields.airline) {
                    airline = (formFields.airline as any).airline;
                }
            }
        }

        const accountFilters: Partial<RatingFilters> = {
            airline: airline,
            startDate: formFields.startDate ? moment(formFields.startDate).utc(true) : undefined,
            endDate: formFields.endDate ? moment(formFields.endDate).utc(true) : undefined,
            answered: formFields.answered,
            flightNumber: formFields.flightNumber ? formFields.flightNumber.trim() : undefined,
            status: formFields.status,
        };
        // Trim & remove null or empty value from result
        return trimAndCleanObject(accountFilters);
    }
}
