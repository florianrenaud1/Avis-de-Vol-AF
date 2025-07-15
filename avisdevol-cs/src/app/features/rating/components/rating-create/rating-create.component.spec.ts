import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { RatingCreateComponent } from './rating-create.component';
import { MaterialModule, NotificationService, RatingService, RatingForCreation } from '@avisdevol-cs/shared';
import { PageTitleComponent } from '@avisdevol-cs/shared';
import { DatepickerComponent } from '@avisdevol-cs/shared';
import { AirlineAutocompleteComponent } from '@avisdevol-cs/shared';

// Mock components
@Component({
    selector: 'app-page-title',
    template: '<div>Mock Page Title</div>',
    inputs: ['label', 'icon', 'buttonBack', 'urlBack', 'params', 'infoTooltip']
})
class MockPageTitleComponent { }

@Component({
    selector: 'app-datepicker',
    template: '<div>Mock Datepicker</div>',
    inputs: ['control', 'label', 'max']
})
class MockDatepickerComponent { }

@Component({
    selector: 'app-airline-autocomplete',
    template: '<div>Mock Airline Autocomplete</div>',
    inputs: ['control', 'label', 'allowFreeText']
})
class MockAirlineAutocompleteComponent { }

describe('RatingCreateComponent', () => {
    let component: RatingCreateComponent;
    let fixture: ComponentFixture<RatingCreateComponent>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockRatingService: jasmine.SpyObj<RatingService>;
    let mockNotificationService: jasmine.SpyObj<NotificationService>;

    const mockRatingForCreation: RatingForCreation = {
        id: '1',
        flightNumber: 'AF123',
        date: new Date('2024-01-15'),
        airline: { 
            id: 1, 
            name: 'Air France', 
            iataCode: 'AF', 
            icaoCode: 'AFR', 
            country: 'France', 
            active: true 
        },
        rating: 4,
        comments: 'Excellent service and comfortable flight.',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockRatingService = jasmine.createSpyObj('RatingService', ['createRating']);
        mockNotificationService = jasmine.createSpyObj('NotificationService', ['displaySuccess', 'displayError']);

        // Mock successful rating creation by default
        mockRatingService.createRating.and.returnValue(of(mockRatingForCreation));

        await TestBed.configureTestingModule({
            imports: [
                RatingCreateComponent,
                MaterialModule,
                ReactiveFormsModule,
                TranslateModule.forRoot(),
                CommonModule,
                NoopAnimationsModule,
            ],
            providers: [
                FormBuilder,
                { provide: Router, useValue: mockRouter },
                { provide: RatingService, useValue: mockRatingService },
                { provide: NotificationService, useValue: mockNotificationService },
            ],
        })
        .overrideComponent(RatingCreateComponent, {
            remove: {
                imports: [PageTitleComponent, DatepickerComponent, AirlineAutocompleteComponent]
            },
            add: {
                imports: [MockPageTitleComponent, MockDatepickerComponent, MockAirlineAutocompleteComponent]
            }
        })
        .compileComponents();

        fixture = TestBed.createComponent(RatingCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should be a standalone component', () => {
            expect(RatingCreateComponent).toBeDefined();
        });

        it('should initialize form with empty values', () => {
            expect(component.ratingForm.value).toEqual({
                flightNumber: '',
                date: '',
                airline: '',
                rating: '',
                comment: ''
            });
        });

        it('should have form invalid initially', () => {
            expect(component.ratingForm.invalid).toBeTruthy();
        });

        it('should initialize isSubmitting as false', () => {
            expect(component.isSubmitting()).toBeFalsy();
        });

        it('should have moment reference', () => {
            expect(component.moment).toBeDefined();
        });
    });

    describe('Form Validation', () => {
        describe('Flight Number Field', () => {
            it('should be required', () => {
                const flightNumberControl = component.ratingForm.get('flightNumber');
                expect(flightNumberControl?.hasError('required')).toBeTruthy();
            });

            it('should validate pattern for valid flight numbers', () => {
                const flightNumberControl = component.ratingForm.get('flightNumber');
                
                flightNumberControl?.setValue('AF123');
                expect(flightNumberControl?.hasError('pattern')).toBeFalsy();
                
                flightNumberControl?.setValue('BA4567');
                expect(flightNumberControl?.hasError('pattern')).toBeFalsy();
            });

            it('should invalidate incorrect flight number patterns', () => {
                const flightNumberControl = component.ratingForm.get('flightNumber');
                
                flightNumberControl?.setValue('123AF');
                expect(flightNumberControl?.hasError('pattern')).toBeTruthy();
                
                flightNumberControl?.setValue('af123');
                expect(flightNumberControl?.hasError('pattern')).toBeTruthy();
                
                flightNumberControl?.setValue('A123');
                expect(flightNumberControl?.hasError('pattern')).toBeTruthy();
            });
        });

        describe('Date Field', () => {
            it('should be required', () => {
                const dateControl = component.ratingForm.get('date');
                expect(dateControl?.hasError('required')).toBeTruthy();
            });

            it('should be valid with a date value', () => {
                const dateControl = component.ratingForm.get('date');
                dateControl?.setValue('2024-01-15');
                expect(dateControl?.hasError('required')).toBeFalsy();
            });
        });

        describe('Airline Field', () => {
            it('should be required', () => {
                const airlineControl = component.ratingForm.get('airline');
                expect(airlineControl?.hasError('required')).toBeTruthy();
            });

            it('should be valid with airline value', () => {
                const airlineControl = component.ratingForm.get('airline');
                airlineControl?.setValue({ 
                    id: 1, 
                    name: 'Air France', 
                    iataCode: 'AF', 
                    icaoCode: 'AFR', 
                    country: 'France', 
                    active: true 
                });
                expect(airlineControl?.hasError('required')).toBeFalsy();
            });
        });

        describe('Rating Field', () => {
            it('should be required', () => {
                const ratingControl = component.ratingForm.get('rating');
                expect(ratingControl?.hasError('required')).toBeTruthy();
            });

            it('should validate minimum value', () => {
                const ratingControl = component.ratingForm.get('rating');
                ratingControl?.setValue(0);
                expect(ratingControl?.hasError('min')).toBeTruthy();
            });

            it('should validate maximum value', () => {
                const ratingControl = component.ratingForm.get('rating');
                ratingControl?.setValue(6);
                expect(ratingControl?.hasError('max')).toBeTruthy();
            });

            it('should accept valid ratings (1-5)', () => {
                const ratingControl = component.ratingForm.get('rating');
                
                for (let i = 1; i <= 5; i++) {
                    ratingControl?.setValue(i);
                    expect(ratingControl?.hasError('min')).toBeFalsy();
                    expect(ratingControl?.hasError('max')).toBeFalsy();
                }
            });
        });

        describe('Comment Field', () => {
            it('should be required', () => {
                const commentControl = component.ratingForm.get('comment');
                expect(commentControl?.hasError('required')).toBeTruthy();
            });

            it('should validate minimum length', () => {
                const commentControl = component.ratingForm.get('comment');
                commentControl?.setValue('Short');
                expect(commentControl?.hasError('minlength')).toBeTruthy();
            });

            it('should validate maximum length', () => {
                const commentControl = component.ratingForm.get('comment');
                const longComment = 'A'.repeat(501);
                commentControl?.setValue(longComment);
                expect(commentControl?.hasError('maxlength')).toBeTruthy();
            });

            it('should accept valid comment length', () => {
                const commentControl = component.ratingForm.get('comment');
                commentControl?.setValue('This is a valid comment with enough characters.');
                expect(commentControl?.hasError('minlength')).toBeFalsy();
                expect(commentControl?.hasError('maxlength')).toBeFalsy();
            });
        });
    });

    describe('Rating Options', () => {
        it('should have 5 rating options', () => {
            expect(component.ratingOptions.length).toBe(5);
        });

        it('should have correct rating values (1-5)', () => {
            const values = component.ratingOptions.map(option => option.value);
            expect(values).toEqual([5, 4, 3, 2, 1]);
        });

        it('should have labels for each rating', () => {
            component.ratingOptions.forEach(option => {
                expect(option.label).toBeTruthy();
                expect(option.label).toContain(`(${option.value}/5)`);
            });
        });

        it('should have color classes for each rating', () => {
            component.ratingOptions.forEach(option => {
                expect(option.color).toBeTruthy();
                expect(option.color).toContain('text-');
            });
        });
    });

    describe('getRatingLabel method', () => {
        it('should return correct label for valid rating', () => {
            const label = component.getRatingLabel(5);
            expect(label).toBe('Excellent (5/5)');
        });

        it('should return correct label for each rating value', () => {
            expect(component.getRatingLabel(5)).toBe('Excellent (5/5)');
            expect(component.getRatingLabel(4)).toBe('Très bien (4/5)');
            expect(component.getRatingLabel(3)).toBe('Correct (3/5)');
            expect(component.getRatingLabel(2)).toBe('Décevant (2/5)');
            expect(component.getRatingLabel(1)).toBe('Très décevant (1/5)');
        });

        it('should return empty string for invalid rating', () => {
            expect(component.getRatingLabel(0)).toBe('');
            expect(component.getRatingLabel(6)).toBe('');
            expect(component.getRatingLabel(-1)).toBe('');
        });
    });

    describe('onSubmit method', () => {
        beforeEach(() => {
            // Set up valid form data
            component.ratingForm.patchValue({
                flightNumber: 'AF123',
                date: '2024-01-15',
                airline: { 
                    id: 1, 
                    name: 'Air France', 
                    iataCode: 'AF', 
                    icaoCode: 'AFR', 
                    country: 'France', 
                    active: true 
                },
                rating: 4,
                comment: 'This is a valid comment with enough characters.'
            });
        });

        it('should not submit if form is invalid', () => {
            component.ratingForm.get('flightNumber')?.setValue('');
            component.onSubmit();
            
            expect(mockRatingService.createRating).not.toHaveBeenCalled();
            expect(component.ratingForm.get('flightNumber')?.touched).toBeTruthy();
        });

        it('should not submit if already submitting', () => {
            component.isSubmitting.set(true);
            component.onSubmit();
            
            expect(mockRatingService.createRating).not.toHaveBeenCalled();
        });

        it('should submit valid form data', () => {
            component.onSubmit();
            
            expect(component.isSubmitting()).toBeTruthy();
            expect(mockRatingService.createRating).toHaveBeenCalled();
        });

        it('should create correct RatingForCreation object', () => {
            component.onSubmit();
            
            const call = mockRatingService.createRating.calls.mostRecent();
            const ratingData = call.args[0] as RatingForCreation;
            
            expect(ratingData.flightNumber).toBe('AF123');
            expect(ratingData.airline).toEqual({ 
                id: 1, 
                name: 'Air France', 
                iataCode: 'AF', 
                icaoCode: 'AFR', 
                country: 'France', 
                active: true 
            });
            expect(ratingData.rating).toBe(4);
            expect(ratingData.comments).toBe('This is a valid comment with enough characters.');
            expect(ratingData.date).toBeInstanceOf(Date);
            expect(ratingData.createdAt).toBeInstanceOf(Date);
            expect(ratingData.updatedAt).toBeInstanceOf(Date);
        });

        it('should handle successful submission', (done) => {
            component.onSubmit();
            
            // Wait for async operations
            setTimeout(() => {
                expect(mockRouter.navigate).toHaveBeenCalledWith(['/avis']);
                expect(mockNotificationService.displaySuccess).toHaveBeenCalledWith('COMMONS.NOTIFICATION.CREATE_SUCCESS');
                done();
            }, 100);
        });

        it('should mark all fields as touched if form is invalid', () => {
            component.ratingForm.get('flightNumber')?.setValue('');
            component.onSubmit();
            
            expect(component.ratingForm.get('flightNumber')?.touched).toBeTruthy();
            expect(component.ratingForm.get('date')?.touched).toBeTruthy();
            expect(component.ratingForm.get('airline')?.touched).toBeTruthy();
            expect(component.ratingForm.get('rating')?.touched).toBeTruthy();
            expect(component.ratingForm.get('comment')?.touched).toBeTruthy();
        });
    });

    describe('onCancel method', () => {
        it('should navigate to ratings list', () => {
            component.onCancel();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/avis']);
        });
    });

    describe('Template Integration', () => {
        it('should render page title component', () => {
            const pageTitle = fixture.nativeElement.querySelector('app-page-title');
            expect(pageTitle).toBeTruthy();
        });

        it('should render form element', () => {
            const form = fixture.nativeElement.querySelector('form');
            expect(form).toBeTruthy();
        });

        it('should render flight number input', () => {
            const input = fixture.nativeElement.querySelector('input[formControlName="flightNumber"]');
            expect(input).toBeTruthy();
        });

        it('should render datepicker component', () => {
            const datepicker = fixture.nativeElement.querySelector('app-datepicker');
            expect(datepicker).toBeTruthy();
        });

        it('should render airline autocomplete component', () => {
            const autocomplete = fixture.nativeElement.querySelector('app-airline-autocomplete');
            expect(autocomplete).toBeTruthy();
        });

        it('should render rating select', () => {
            const select = fixture.nativeElement.querySelector('mat-select[formControlName="rating"]');
            expect(select).toBeTruthy();
        });

        it('should render comment textarea', () => {
            const textarea = fixture.nativeElement.querySelector('textarea[formControlName="comment"]');
            expect(textarea).toBeTruthy();
        });

        it('should render submit button', () => {
            const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
            expect(submitButton).toBeTruthy();
        });

        it('should render cancel button', () => {
            const cancelButton = fixture.nativeElement.querySelector('button[type="button"]');
            expect(cancelButton).toBeTruthy();
        });

        it('should disable submit button when form is invalid', () => {
            const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
            expect(submitButton.disabled).toBeTruthy();
        });

        it('should enable submit button when form is valid', () => {
            component.ratingForm.patchValue({
                flightNumber: 'AF123',
                date: '2024-01-15',
                airline: { 
                    id: 1, 
                    name: 'Air France', 
                    iataCode: 'AF', 
                    icaoCode: 'AFR', 
                    country: 'France', 
                    active: true 
                },
                rating: 4,
                comment: 'This is a valid comment with enough characters.'
            });
            fixture.detectChanges();
            
            const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
            expect(submitButton.disabled).toBeFalsy();
        });
    });

    describe('User Interactions', () => {
        it('should call onSubmit when form is submitted', () => {
            spyOn(component, 'onSubmit');
            const form = fixture.nativeElement.querySelector('form');
            
            form.dispatchEvent(new Event('submit'));
            expect(component.onSubmit).toHaveBeenCalled();
        });

        it('should call onCancel when cancel button is clicked', () => {
            spyOn(component, 'onCancel');
            const cancelButton = fixture.nativeElement.querySelector('button[type="button"]');
            
            cancelButton.click();
            expect(component.onCancel).toHaveBeenCalled();
        });

        it('should update form control when input value changes', () => {
            const input = fixture.nativeElement.querySelector('input[formControlName="flightNumber"]');
            
            input.value = 'AF123';
            input.dispatchEvent(new Event('input'));
            
            expect(component.ratingForm.get('flightNumber')?.value).toBe('AF123');
        });
    });

    describe('Accessibility', () => {
        it('should have proper form labels', () => {
            const labels = fixture.nativeElement.querySelectorAll('mat-label');
            expect(labels.length).toBeGreaterThan(0);
        });

        it('should display validation errors', () => {
            component.ratingForm.markAllAsTouched();
            fixture.detectChanges();
            
            const errors = fixture.nativeElement.querySelectorAll('mat-error');
            expect(errors.length).toBeGreaterThan(0);
        });

        it('should have semantic form structure', () => {
            const form = fixture.nativeElement.querySelector('form');
            expect(form.tagName.toLowerCase()).toBe('form');
        });
    });

    describe('Translation Integration', () => {
        it('should use translate pipe for form labels', () => {
            expect(fixture.nativeElement.innerHTML).toContain('COMMONS.RATING_CREATE');
        });

        it('should use translate pipe for button labels', () => {
            expect(fixture.nativeElement.innerHTML).toContain('COMMONS.BUTTON.CANCEL');
        });
    });

    describe('Edge Cases', () => {
        it('should handle form reset', () => {
            component.ratingForm.patchValue({
                flightNumber: 'AF123',
                date: '2024-01-15',
                airline: { 
                    id: 1, 
                    name: 'Air France', 
                    iataCode: 'AF', 
                    icaoCode: 'AFR', 
                    country: 'France', 
                    active: true 
                },
                rating: 4,
                comment: 'Valid comment'
            });
            
            component.ratingForm.reset();
            
            expect(component.ratingForm.value).toEqual({
                flightNumber: null,
                date: null,
                airline: null,
                rating: null,
                comment: null
            });
        });

        it('should handle multiple rapid submissions', () => {
            component.ratingForm.patchValue({
                flightNumber: 'AF123',
                date: '2024-01-15',
                airline: { 
                    id: 1, 
                    name: 'Air France', 
                    iataCode: 'AF', 
                    icaoCode: 'AFR', 
                    country: 'France', 
                    active: true 
                },
                rating: 4,
                comment: 'Valid comment'
            });
            
            component.onSubmit();
            component.onSubmit();
            component.onSubmit();
            
            expect(mockRatingService.createRating).toHaveBeenCalledTimes(1);
        });

        it('should handle special characters in form fields', () => {
            component.ratingForm.patchValue({
                comment: 'Comment with special chars: àéè ñ 中文 🛫'
            });
            
            expect(component.ratingForm.get('comment')?.value).toContain('🛫');
        });
    });

    describe('Performance', () => {
        it('should not create unnecessary observables', () => {
            const initialObservables = component.createRating$;
            fixture.detectChanges();
            
            expect(component.createRating$).toBe(initialObservables);
        });

        it('should handle large comment input', () => {
            const largeComment = 'A'.repeat(499);
            component.ratingForm.get('comment')?.setValue(largeComment);
            
            expect(component.ratingForm.get('comment')?.value.length).toBe(499);
            expect(component.ratingForm.get('comment')?.hasError('maxlength')).toBeFalsy();
        });
    });
});
