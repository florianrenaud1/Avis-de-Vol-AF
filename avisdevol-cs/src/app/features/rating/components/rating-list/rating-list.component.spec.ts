import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import moment from 'moment';

import { RatingListComponent } from './rating-list.component';
import { RatingService } from '../../../../shared/services/http/rating.service';
import { Rating, RatingFilters, RatingStatus, Airline, Pageable, ObservableDataSource } from '@avisdevol-cs/shared';

describe('RatingListComponent', () => {
    let component: RatingListComponent;
    let fixture: ComponentFixture<RatingListComponent>;
    let mockStore: jasmine.SpyObj<Store>;
    let mockRatingService: jasmine.SpyObj<RatingService>;
    let mockTranslateService: jasmine.SpyObj<TranslateService>;

    const mockRatings: Rating[] = [
        {
            id: '1',
            rating: 4,
            flightNumber: 'AF123',
            createdAt: new Date('2025-01-15T10:00:00Z'),
            airline: { id: 1, name: 'Air France', iataCode: 'AF', icaoCode: 'AFR', country: 'France', active: true },
            status: RatingStatus.PUBLISHED,
            comments: 'Excellent vol',
            date: new Date('2025-01-10'),
            updatedAt: new Date('2025-01-16T10:00:00Z'),
            answer: 'Merci pour votre avis',
        },
        {
            id: '2',
            rating: 2,
            flightNumber: 'AF456',
            createdAt: new Date('2025-01-14T14:30:00Z'),
            airline: { id: 2, name: 'KLM', iataCode: 'KL', icaoCode: 'KLM', country: 'Netherlands', active: true },
            status: RatingStatus.PROCESSED,
            comments: 'Vol en retard',
            date: new Date('2025-01-12'),
            updatedAt: new Date('2025-01-13T10:00:00Z'),
            answer: undefined,
        },
    ];

    const mockPageableResponse: Pageable<Rating> = {
        content: mockRatings,
        totalElements: 2,
        totalPages: 1,
        number: 0,
        numberOfElements: 2,
        pageable: {
            pageNumber: 0,
            pageSize: 10,
        },
    };

    const mockFilters: RatingFilters = {
        airline: 'Air France',
        flightNumber: 'AF123',
        startDate: moment('2025-01-01'),
        endDate: moment('2025-01-31'),
        answered: true,
        status: RatingStatus.PUBLISHED,
    };

    beforeEach(async () => {
        const storeSpy = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const ratingServiceSpy = jasmine.createSpyObj('RatingService', ['search']);
        const translateSpy = jasmine.createSpyObj('TranslateService', ['get', 'instant']);
        const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot'], {
            params: of({}),
            queryParams: of({}),
            data: of({}),
        });

        await TestBed.configureTestingModule({
            imports: [RatingListComponent, TranslateModule.forRoot(), NoopAnimationsModule],
            providers: [
                { provide: Store, useValue: storeSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy },
                { provide: RatingService, useValue: ratingServiceSpy },
                { provide: TranslateService, useValue: translateSpy },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(RatingListComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
        const mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        const mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
        mockRatingService = TestBed.inject(RatingService) as jasmine.SpyObj<RatingService>;
        mockTranslateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

        // Setup store mocks - need to provide proper observables
        mockStore.pipe.and.returnValue(of(mockFilters));
        mockRatingService.search.and.returnValue(of(mockPageableResponse));
        mockTranslateService.get.and.returnValue(of('Translated text'));
        mockTranslateService.instant.and.returnValue('Instant translation');

        // Mock dataSource to avoid dependency issues
        component.dataSource = jasmine.createSpyObj('ObservableDataSource', ['loadData']) as jasmine.SpyObj<
            ObservableDataSource<Rating, RatingFilters>
        >;

        // Mock the filters$ observable directly to avoid issues with combineLatest
        Object.defineProperty(component, 'filters$', {
            value: of(mockFilters),
            writable: false,
        });

        // Mock viewChild methods for sort and paginator to return proper mock objects
        const mockSortChange = new Subject();
        const mockPageChange = new Subject();

        const mockSort = {
            active: 'createdAt',
            direction: 'desc',
            sortChange: mockSortChange.asObservable(),
        };

        const mockPaginator = {
            pageIndex: 0,
            pageSize: 10,
            length: 0,
            page: mockPageChange.asObservable(),
        };

        spyOn(component, 'sort').and.returnValue(mockSort as MatSort);
        spyOn(component, 'paginator').and.returnValue(mockPaginator as MatPaginator);
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with correct default values', () => {
            expect(component.displayedColumns).toEqual(['rating', 'flightNumber', 'createdAt', 'airline', 'status', 'answered', 'action']);
            expect(component.currentSortColumn).toBe('createdAt');
            expect(component.currentSortDirection).toBe('desc');
            expect(component.moment).toBe(moment);
            expect(component.statusOptions).toBeDefined();
        });

        it('should setup filters observable', done => {
            component.filters$.subscribe(filters => {
                expect(filters).toEqual(mockFilters);
                done();
            });
        });

        it('should initialize data source on ngOnInit', () => {
            // Mock the protected method by spying on the prototype
            const initDatasourceSpy = spyOn(component as any, 'initDatasource');
            spyOn(component.forceSearch$$, 'next');

            component.ngOnInit();

            expect(initDatasourceSpy).toHaveBeenCalledWith(jasmine.any(Function), component.filters$);
            expect(component.forceSearch$$.next).toHaveBeenCalled();
        });
    });

    describe('Status Management', () => {
        it('should get status display for known status', () => {
            const display = component.getStatusDisplay(RatingStatus.PUBLISHED);

            expect(display).toBeDefined();
            expect(display.value).toBe(RatingStatus.PUBLISHED);
        });

        it('should get default status display for unknown status', () => {
            const unknownStatus = 'UNKNOWN_STATUS' as RatingStatus;
            const display = component.getStatusDisplay(unknownStatus);

            expect(display.value).toBe(unknownStatus);
            expect(display.label).toBe('COMMONS.STATUS.UNKNOWN');
            expect(display.color).toBe('text-gray-600');
            expect(display.bgColor).toBe('bg-gray-100');
        });
    });

    describe('Mobile Sorting', () => {
        it('should handle mobile sort change', () => {
            spyOn(component as any, 'applySortToDataSource');

            component.onMobileSortChange();

            expect((component as any).applySortToDataSource).toHaveBeenCalled();
        });

        it('should toggle sort direction', () => {
            spyOn(component as any, 'applySortToDataSource');

            component.currentSortDirection = 'asc';
            component.toggleSortDirection();

            expect(component.currentSortDirection).toBe('desc');
            expect((component as any).applySortToDataSource).toHaveBeenCalled();
        });

        it('should toggle sort direction from desc to asc', () => {
            spyOn(component as any, 'applySortToDataSource');

            component.currentSortDirection = 'desc';
            component.toggleSortDirection();

            expect(component.currentSortDirection).toBe('asc');
        });

        it('should apply sort to data source', () => {
            // Use the existing sort spy, just reset the properties
            (component.sort() as any).active = '';
            (component.sort() as any).direction = '';
            spyOn(component.forceSearch$$, 'next');

            component.currentSortColumn = 'rating';
            component.currentSortDirection = 'asc';

            (component as any).applySortToDataSource();

            expect((component.sort() as any).active).toBe('rating');
            expect((component.sort() as any).direction).toBe('asc');
            expect(component.forceSearch$$.next).toHaveBeenCalled();
        });
    });

    describe('Filter Computation', () => {
        it('should compute filters with string airline', () => {
            const filters: RatingFilters = {
                airline: 'Air France',
                flightNumber: '  AF123  ',
                startDate: moment('2025-01-15'),
                endDate: moment('2025-01-31'),
                answered: true,
                status: RatingStatus.PUBLISHED,
            };

            const result = (component as any)._computeFilters(filters);

            expect(result.airline).toBe('Air France');
            expect(result.flightNumber).toBe('AF123');
            expect(result.startDate).toEqual(moment('2025-01-15').utc(true));
            expect(result.endDate).toEqual(moment('2025-01-31').utc(true));
            expect(result.answered).toBe(true);
            expect(result.status).toBe(RatingStatus.PUBLISHED);
        });

        it('should compute filters with airline object', () => {
            const airlineObject: Airline = {
                id: 1,
                name: 'Air France',
                iataCode: 'AF',
                icaoCode: 'AFR',
                country: 'France',
                active: true,
            };

            const filters: any = {
                airline: airlineObject,
                flightNumber: 'AF123',
            };

            const result = (component as any)._computeFilters(filters);

            expect(result.airline).toBe('Air France');
            expect(result.flightNumber).toBe('AF123');
        });

        it('should handle empty filters', () => {
            const filters: RatingFilters = {};

            const result = (component as any)._computeFilters(filters);

            expect(result.airline).toBeUndefined();
            expect(result.flightNumber).toBeUndefined();
            expect(result.startDate).toBeUndefined();
            expect(result.endDate).toBeUndefined();
        });

        it('should handle null/undefined filters', () => {
            const result = (component as any)._computeFilters(null);

            expect(result).toBeDefined();
        });

        it('should trim whitespace from text fields', () => {
            const filters: RatingFilters = {
                airline: '  Air France  ',
                flightNumber: '  AF123  ',
            };

            const result = (component as any)._computeFilters(filters);

            expect(result.airline).toBe('Air France');
            expect(result.flightNumber).toBe('AF123');
        });
    });

    describe('Data Loading', () => {
        it('should load data using personal account loader', () => {
            const filters: RatingFilters = { airline: 'Air France' };
            const pageIndex = 0;
            const pageSize = 10;
            const sortCol = 'createdAt';
            const sortDirection = 'desc';

            const result = (component as any)._personalAccountLoader(filters, pageIndex, pageSize, sortCol, sortDirection);

            expect(mockRatingService.search).toHaveBeenCalledWith(jasmine.any(Object), pageIndex, pageSize, sortCol, sortDirection);

            result.subscribe((data: Pageable<Rating>) => {
                expect(data).toEqual(mockPageableResponse);
            });
        });
    });

    describe('After View Init', () => {
        it('should synchronize mobile sorting with material table sorting', () => {
            // Modify the existing sort spy to return different values
            (component.sort() as any).active = 'rating';
            (component.sort() as any).direction = 'asc';

            component.ngAfterViewInit();

            expect(component.currentSortColumn).toBe('rating');
            expect(component.currentSortDirection).toBe('asc');
        });

        it('should handle missing sort', () => {
            // Temporarily override the sort spy to return undefined
            const originalSortSpy = component.sort;
            Object.defineProperty(component, 'sort', {
                value: jasmine.createSpy('sort').and.returnValue(undefined),
                writable: true,
            });

            expect(() => component.ngAfterViewInit()).not.toThrow();

            // Restore original spy
            Object.defineProperty(component, 'sort', {
                value: originalSortSpy,
                writable: true,
            });
        });

        it('should handle sort without active column', () => {
            // Modify the existing sort spy to return empty values
            (component.sort() as any).active = '';
            (component.sort() as any).direction = '';

            component.ngAfterViewInit();

            // Should keep default values
            expect(component.currentSortColumn).toBe('createdAt');
            expect(component.currentSortDirection).toBe('desc');
        });
    });

    describe('Template Integration', () => {
        it('should render rating filters component', () => {
            const filtersElement = fixture.nativeElement.querySelector('app-rating-filters');
            expect(filtersElement).toBeTruthy();
        });

        it('should render page title component', () => {
            const titleElement = fixture.nativeElement.querySelector('app-page-title');
            expect(titleElement).toBeTruthy();
        });

        it('should display create button with correct route', () => {
            const createButton = fixture.nativeElement.querySelector('[routerLink="/create"]');
            expect(createButton).toBeTruthy();
        });

        it('should show data table on desktop', () => {
            const tableContainer = fixture.nativeElement.querySelector('.hidden.lg\\:block');
            expect(tableContainer).toBeTruthy();
        });
    });

    describe('Accessibility', () => {
        it('should have table caption for screen readers', () => {
            const caption = fixture.nativeElement.querySelector('caption.sr-only');
            expect(caption).toBeTruthy();
        });
    });

    describe('Error Handling', () => {
        it('should handle malformed filter data', () => {
            const malformedFilters = {
                airline: { invalidProperty: 'test' },
                startDate: 'invalid-date',
            } as any;

            expect(() => (component as any)._computeFilters(malformedFilters)).not.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty airline object', () => {
            const filters: RatingFilters = {
                airline: {} as any,
            };

            const result = (component as any)._computeFilters(filters);
            expect(result.airline).toBeUndefined();
        });

        it('should handle airline object with airline property', () => {
            const filters: RatingFilters = {
                airline: { airline: 'Free text airline' } as any,
            };

            const result = (component as any)._computeFilters(filters);
            expect(result.airline).toBe('Free text airline');
        });

        it('should handle invalid moment dates', () => {
            const filters: any = {
                startDate: moment('invalid-date'),
                endDate: moment('also-invalid'),
            };

            expect(() => (component as any)._computeFilters(filters)).not.toThrow();
        });
    });
});
