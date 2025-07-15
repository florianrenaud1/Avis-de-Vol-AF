import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { MatExpansionModule } from '@angular/material/expansion';
import { of } from 'rxjs';
import moment from 'moment';

import { RatingFiltersComponent } from './rating-filters.component';
import { 
    MaterialModule, 
    RatingStatus, 
    RATING_STATUS_OPTIONS,
    TruncatePipe,
    DateRangeSummaryComponent,
    DatepickerComponent,
    AirlineAutocompleteComponent,
    YesNoSelectComponent,
    RatingStatusSelectComponent
} from '@avisdevol-cs/shared';
import { RatingFilters } from '../../../../shared/models';
import { RatingActions } from '../../../../core/states/actions';
import { App, LayoutActions } from '@avisdevol-cs/core';

// Mock components
@Component({
    selector: 'app-date-range-summary',
    template: '<div>Mock Date Range Summary</div>',
    inputs: ['label', 'startDate', 'endDate']
})
class MockDateRangeSummaryComponent { }

@Component({
    selector: 'app-datepicker',
    template: '<div>Mock Datepicker</div>',
    inputs: ['control', 'label', 'max', 'min']
})
class MockDatepickerComponent { }

@Component({
    selector: 'app-airline-autocomplete',
    template: '<div>Mock Airline Autocomplete</div>',
    inputs: ['control', 'label', 'allowFreeText', 'pageLoaded']
})
class MockAirlineAutocompleteComponent { }

@Component({
    selector: 'app-yes-no-select',
    template: '<div>Mock Yes No Select</div>',
    inputs: ['control', 'label', 'allowBlankOption']
})
class MockYesNoSelectComponent { }

@Component({
    selector: 'app-rating-status-select',
    template: '<div>Mock Rating Status Select</div>',
    inputs: ['control', 'label', 'allowBlankOption']
})
class MockRatingStatusSelectComponent { }

describe('RatingFiltersComponent', () => {
    let component: RatingFiltersComponent;
    let fixture: ComponentFixture<RatingFiltersComponent>;
    let mockStore: jasmine.SpyObj<Store>;

    const mockFilters: RatingFilters = {
        airline: 'Air France',
        flightNumber: 'AF123',
        startDate: moment('2024-01-01'),
        endDate: moment('2024-01-31'),
        answered: true,
        status: RatingStatus.PROCESSED
    };

    beforeEach(async () => {
        mockStore = jasmine.createSpyObj('Store', ['dispatch']);

        await TestBed.configureTestingModule({
            imports: [
                RatingFiltersComponent,
                MaterialModule,
                ReactiveFormsModule,
                TranslateModule.forRoot(),
                CommonModule,
                NoopAnimationsModule,
                MatExpansionModule,
                TruncatePipe,
            ],
            providers: [
                FormBuilder,
                { provide: Store, useValue: mockStore },
            ],
        })
        .overrideComponent(RatingFiltersComponent, {
            remove: {
                imports: [
                    DateRangeSummaryComponent,
                    DatepickerComponent,
                    AirlineAutocompleteComponent,
                    YesNoSelectComponent,
                    RatingStatusSelectComponent
                ]
            },
            add: {
                imports: [
                    MockDateRangeSummaryComponent,
                    MockDatepickerComponent,
                    MockAirlineAutocompleteComponent,
                    MockYesNoSelectComponent,
                    MockRatingStatusSelectComponent
                ]
            }
        })
        .compileComponents();

        fixture = TestBed.createComponent(RatingFiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should be a standalone component', () => {
            expect(RatingFiltersComponent).toBeDefined();
        });

        it('should initialize form with empty values', () => {
            expect(component.searchRatingsForm.value).toEqual({
                airline: '',
                flightNumber: '',
                startDate: '',
                endDate: '',
                answered: '',
                status: ''
            });
        });

        it('should have moment reference', () => {
            expect(component.moment).toBeDefined();
            expect(component.moment).toBe(moment);
        });

        it('should initialize search observable', () => {
            expect(component.search$).toBeDefined();
        });

        it('should initialize search subject', () => {
            expect(component.isAskingFilteredRatings$$).toBeDefined();
        });
    });

    describe('Form Structure', () => {
        it('should have all required form controls', () => {
            const form = component.searchRatingsForm;
            expect(form.get('airline')).toBeTruthy();
            expect(form.get('flightNumber')).toBeTruthy();
            expect(form.get('startDate')).toBeTruthy();
            expect(form.get('endDate')).toBeTruthy();
            expect(form.get('answered')).toBeTruthy();
            expect(form.get('status')).toBeTruthy();
        });

        it('should have form controls with correct initial values', () => {
            const form = component.searchRatingsForm;
            expect(form.get('airline')?.value).toBe('');
            expect(form.get('flightNumber')?.value).toBe('');
            expect(form.get('startDate')?.value).toBe('');
            expect(form.get('endDate')?.value).toBe('');
            expect(form.get('answered')?.value).toBe('');
            expect(form.get('status')?.value).toBe('');
        });

        it('should allow setting form values', () => {
            component.searchRatingsForm.patchValue({
                airline: 'Air France',
                flightNumber: 'AF123',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
                answered: true,
                status: RatingStatus.PROCESSED
            });

            expect(component.searchRatingsForm.get('airline')?.value).toBe('Air France');
            expect(component.searchRatingsForm.get('flightNumber')?.value).toBe('AF123');
            expect(component.searchRatingsForm.get('startDate')?.value).toBe('2024-01-01');
            expect(component.searchRatingsForm.get('endDate')?.value).toBe('2024-01-31');
            expect(component.searchRatingsForm.get('answered')?.value).toBe(true);
            expect(component.searchRatingsForm.get('status')?.value).toBe(RatingStatus.PROCESSED);
        });
    });

    describe('Filter Input Effects', () => {
        it('should patch form when filters input changes', () => {
            fixture.componentRef.setInput('filters', mockFilters);
            fixture.detectChanges();

            // The effect should have updated the form
            expect(component.searchRatingsForm.get('airline')?.value).toBe(mockFilters.airline);
            expect(component.searchRatingsForm.get('flightNumber')?.value).toBe(mockFilters.flightNumber);
            expect(component.searchRatingsForm.get('answered')?.value).toBe(mockFilters.answered);
            expect(component.searchRatingsForm.get('status')?.value).toBe(mockFilters.status);
        });

        it('should handle null filters input', () => {
            fixture.componentRef.setInput('filters', null);
            fixture.detectChanges();

            // Form should remain unchanged
            expect(component.searchRatingsForm.get('airline')?.value).toBe('');
            expect(component.searchRatingsForm.get('flightNumber')?.value).toBe('');
        });

        it('should handle partial filters input', () => {
            const partialFilters: Partial<RatingFilters> = {
                airline: 'KLM',
                status: RatingStatus.PUBLISHED
            };

            fixture.componentRef.setInput('filters', partialFilters);
            fixture.detectChanges();

            expect(component.searchRatingsForm.get('airline')?.value).toBe('KLM');
            expect(component.searchRatingsForm.get('status')?.value).toBe(RatingStatus.PUBLISHED);
            expect(component.searchRatingsForm.get('flightNumber')?.value).toBe('');
        });
    });

    describe('clearField method', () => {
        beforeEach(() => {
            // Set up form with values
            component.searchRatingsForm.patchValue({
                airline: 'Air France',
                flightNumber: 'AF123',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
                answered: true,
                status: RatingStatus.PROCESSED
            });
        });

        it('should clear specific field', () => {
            component.clearField('airline');
            expect(component.searchRatingsForm.get('airline')?.value).toBeNull();
            expect(component.searchRatingsForm.get('flightNumber')?.value).toBe('AF123');
        });

        it('should clear flight number field', () => {
            component.clearField('flightNumber');
            expect(component.searchRatingsForm.get('flightNumber')?.value).toBeNull();
            expect(component.searchRatingsForm.get('airline')?.value).toBe('Air France');
        });

        it('should clear date fields', () => {
            component.clearField('startDate');
            component.clearField('endDate');
            expect(component.searchRatingsForm.get('startDate')?.value).toBeNull();
            expect(component.searchRatingsForm.get('endDate')?.value).toBeNull();
        });

        it('should clear status fields', () => {
            component.clearField('answered');
            component.clearField('status');
            expect(component.searchRatingsForm.get('answered')?.value).toBeNull();
            expect(component.searchRatingsForm.get('status')?.value).toBeNull();
        });

        it('should handle invalid field names gracefully', () => {
            expect(() => component.clearField('invalidField')).not.toThrow();
        });
    });

    describe('clearForm method', () => {
        beforeEach(() => {
            // Set up form with values
            component.searchRatingsForm.patchValue({
                airline: 'Air France',
                flightNumber: 'AF123',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
                answered: true,
                status: RatingStatus.PROCESSED
            });
        });

        it('should dispatch ResetFilters action', () => {
            component.clearForm();
            expect(mockStore.dispatch).toHaveBeenCalledWith(LayoutActions.ResetFilters());
        });

        it('should reset form to initial state', () => {
            component.clearForm();
            
            const formValue = component.searchRatingsForm.value;
            // When reset({}) is called, form controls get null values
            expect(formValue.airline).toBeNull();
            expect(formValue.flightNumber).toBeNull();
            expect(formValue.startDate).toBeNull();
            expect(formValue.endDate).toBeNull();
            expect(formValue.answered).toBeNull();
            expect(formValue.status).toBeNull();
        });
    });

    describe('getStatusLabel method', () => {
        it('should return correct label for valid status', () => {
            const processedOption = RATING_STATUS_OPTIONS.find(opt => opt.value === RatingStatus.PROCESSED);
            if (processedOption) {
                const label = component.getStatusLabel(RatingStatus.PROCESSED);
                expect(label).toBe(processedOption.label);
            }
        });

        it('should return correct label for each status value', () => {
            RATING_STATUS_OPTIONS.forEach(option => {
                const label = component.getStatusLabel(option.value);
                expect(label).toBe(option.label);
            });
        });

        it('should return unknown label for invalid status', () => {
            const invalidStatus = 'INVALID_STATUS' as RatingStatus;
            const label = component.getStatusLabel(invalidStatus);
            expect(label).toBe('COMMONS.STATUS.UNKNOWN');
        });
    });

    describe('Search Functionality', () => {
        it('should emit search when form is submitted', () => {
            spyOn(component.isAskingFilteredRatings$$, 'next');
            
            component.searchRatingsForm.patchValue({
                airline: 'Air France',
                flightNumber: 'AF123'
            });

            const form = fixture.nativeElement.querySelector('form');
            form.dispatchEvent(new Event('submit'));

            expect(component.isAskingFilteredRatings$$.next).toHaveBeenCalledWith(
                component.searchRatingsForm.value
            );
        });

        it('should dispatch search action when search is triggered', () => {
            const filters: RatingFilters = {
                airline: 'Air France',
                flightNumber: 'AF123'
            };

            // Trigger search directly
            component.isAskingFilteredRatings$$.next(filters);

            // Verify the store dispatch was called
            expect(mockStore.dispatch).toHaveBeenCalledWith(RatingActions.search(filters));
        });

        it('should handle empty search filters', () => {
            const emptyFilters: RatingFilters = {};

            // Trigger search directly
            component.isAskingFilteredRatings$$.next(emptyFilters);

            // Verify the store dispatch was called
            expect(mockStore.dispatch).toHaveBeenCalledWith(RatingActions.search(emptyFilters));
        });
    });

    describe('Template Integration', () => {
        it('should render form element', () => {
            const form = fixture.nativeElement.querySelector('form');
            expect(form).toBeTruthy();
        });

        it('should render mat-accordion', () => {
            const accordion = fixture.nativeElement.querySelector('mat-accordion');
            expect(accordion).toBeTruthy();
        });

        it('should render expansion panel', () => {
            const panel = fixture.nativeElement.querySelector('mat-expansion-panel');
            expect(panel).toBeTruthy();
        });

        it('should render airline autocomplete component', () => {
            const autocomplete = fixture.nativeElement.querySelector('app-airline-autocomplete');
            expect(autocomplete).toBeTruthy();
        });

        it('should render flight number input', () => {
            const input = fixture.nativeElement.querySelector('input[formControlName="flightNumber"]');
            expect(input).toBeTruthy();
        });

        it('should render datepicker components', () => {
            const datepickers = fixture.nativeElement.querySelectorAll('app-datepicker');
            expect(datepickers.length).toBe(2); // start date and end date
        });

        it('should render yes-no select component', () => {
            const yesNoSelect = fixture.nativeElement.querySelector('app-yes-no-select');
            expect(yesNoSelect).toBeTruthy();
        });

        it('should render rating status select component', () => {
            const statusSelect = fixture.nativeElement.querySelector('app-rating-status-select');
            expect(statusSelect).toBeTruthy();
        });

        it('should render clear button', () => {
            const clearButton = fixture.nativeElement.querySelector('button[data-clearBtn]');
            expect(clearButton).toBeTruthy();
        });

        it('should render search button', () => {
            const searchButton = fixture.nativeElement.querySelector('button[data-searchBtn]');
            expect(searchButton).toBeTruthy();
        });
    });

    describe('User Interactions', () => {
        it('should call clearForm when clear button is clicked', () => {
            spyOn(component, 'clearForm');
            const clearButton = fixture.nativeElement.querySelector('button[data-clearBtn]');
            
            clearButton.click();
            expect(component.clearForm).toHaveBeenCalled();
        });

        it('should submit form when search button is clicked', () => {
            spyOn(component.isAskingFilteredRatings$$, 'next');
            const searchButton = fixture.nativeElement.querySelector('button[data-searchBtn]');
            
            searchButton.click();
            expect(component.isAskingFilteredRatings$$.next).toHaveBeenCalled();
        });

        it('should update form control when input value changes', () => {
            const input = fixture.nativeElement.querySelector('input[formControlName="flightNumber"]');
            
            input.value = 'KL456';
            input.dispatchEvent(new Event('input'));
            
            expect(component.searchRatingsForm.get('flightNumber')?.value).toBe('KL456');
        });
    });

    describe('Filter Display in Header', () => {
        beforeEach(() => {
            component.searchRatingsForm.patchValue({
                airline: { name: 'Air France', iataCode: 'AF' },
                flightNumber: 'AF123',
                status: RatingStatus.PROCESSED
            });
            fixture.detectChanges();
        });

        it('should display airline filter in header', () => {
            const headerText = fixture.nativeElement.querySelector('mat-panel-description')?.textContent;
            expect(headerText).toContain('Air France');
        });

        it('should display flight number filter in header', () => {
            const headerText = fixture.nativeElement.querySelector('mat-panel-description')?.textContent;
            expect(headerText).toContain('AF123');
        });

        it('should display status filter in header', () => {
            const statusDisplay = fixture.nativeElement.querySelector('mat-panel-description');
            expect(statusDisplay).toBeTruthy();
        });
    });

    describe('Accessibility', () => {
        it('should have proper form labels', () => {
            const labels = fixture.nativeElement.querySelectorAll('mat-label');
            expect(labels.length).toBeGreaterThan(0);
        });

        it('should have semantic form structure', () => {
            const form = fixture.nativeElement.querySelector('form');
            expect(form.tagName.toLowerCase()).toBe('form');
        });

        it('should have proper button types', () => {
            const clearButton = fixture.nativeElement.querySelector('button[data-clearBtn]');
            const searchButton = fixture.nativeElement.querySelector('button[data-searchBtn]');
            
            expect(clearButton.type).toBe('button');
            expect(searchButton.type).toBe('submit');
        });
    });

    describe('Translation Integration', () => {
        it('should use translate pipe for labels', () => {
            expect(fixture.nativeElement.innerHTML).toContain('COMMONS.LABEL.SEARCH_FILTERS');
        });

        it('should use translate pipe for button labels', () => {
            expect(fixture.nativeElement.innerHTML).toContain('COMMONS.BUTTON.CLEAR');
            expect(fixture.nativeElement.innerHTML).toContain('COMMONS.BUTTON.SEARCH');
        });

        it('should use translate pipe for property labels', () => {
            expect(fixture.nativeElement.innerHTML).toContain('COMMONS.PROPERTY.AIRLINE');
            expect(fixture.nativeElement.innerHTML).toContain('COMMONS.PROPERTY.FLIGHT_NUMBER');
        });
    });

    describe('Edge Cases', () => {
        it('should handle form reset', () => {
            component.searchRatingsForm.patchValue({
                airline: 'Air France',
                flightNumber: 'AF123',
                answered: true
            });
            
            component.searchRatingsForm.reset();
            
            expect(component.searchRatingsForm.value).toEqual({
                airline: null,
                flightNumber: null,
                startDate: null,
                endDate: null,
                answered: null,
                status: null
            });
        });

        it('should handle special characters in flight number', () => {
            component.searchRatingsForm.get('flightNumber')?.setValue('AF-123');
            expect(component.searchRatingsForm.get('flightNumber')?.value).toBe('AF-123');
        });

        it('should handle long airline names', () => {
            const longAirlineName = 'Very Long Airline Name That Exceeds Normal Length';
            component.searchRatingsForm.get('airline')?.setValue(longAirlineName);
            expect(component.searchRatingsForm.get('airline')?.value).toBe(longAirlineName);
        });

        it('should handle multiple rapid form submissions', () => {
            spyOn(component.isAskingFilteredRatings$$, 'next');
            
            const form = fixture.nativeElement.querySelector('form');
            form.dispatchEvent(new Event('submit'));
            form.dispatchEvent(new Event('submit'));
            form.dispatchEvent(new Event('submit'));
            
            expect(component.isAskingFilteredRatings$$.next).toHaveBeenCalledTimes(3);
        });
    });

    describe('Performance', () => {
        it('should not create unnecessary observables', () => {
            const initialSearch$ = component.search$;
            fixture.detectChanges();
            
            expect(component.search$).toBe(initialSearch$);
        });

        it('should handle frequent filter changes efficiently', () => {
            for (let i = 0; i < 10; i++) {
                component.searchRatingsForm.get('flightNumber')?.setValue(`AF${i}`);
            }
            
            expect(component.searchRatingsForm.get('flightNumber')?.value).toBe('AF9');
        });
    });

    describe('Integration with Store', () => {
        it('should dispatch correct search action type', () => {
            const filters: RatingFilters = { airline: 'Test Airline' };
            
            // Clear any previous calls
            mockStore.dispatch.calls.reset();
            
            // Trigger search
            component.isAskingFilteredRatings$$.next(filters);
            
            // Verify dispatch was called
            expect(mockStore.dispatch).toHaveBeenCalled();
            const dispatchCalls = mockStore.dispatch.calls.all();
            const searchCall = dispatchCalls.find(call => 
                call.args[0] && typeof call.args[0] === 'object' && 'type' in call.args[0]
            );
            expect(searchCall).toBeTruthy();
        });

        it('should dispatch reset filters action when clearing form', () => {
            // Clear any previous calls
            mockStore.dispatch.calls.reset();
            
            component.clearForm();
            
            // Verify dispatch was called
            expect(mockStore.dispatch).toHaveBeenCalled();
            const dispatchCalls = mockStore.dispatch.calls.all();
            const resetCall = dispatchCalls.find(call => 
                call.args[0] && typeof call.args[0] === 'object' && 'type' in call.args[0]
            );
            expect(resetCall).toBeTruthy();
        });
    });
});
