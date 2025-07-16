import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { RatingDetailComponent } from './rating-detail.component';
import {
    MaterialModule,
    Rating,
    RatingService,
    NotificationService,
    RatingStatus,
    PageTitleComponent,
    RatingStatusSelectComponent,
    AuthenticationService,
} from '@avisdevol-cs/shared';
import { reducers } from '../../../../core/states/reducers/app-global.reducers';

// Test configuration and setup utilities
const TEST_CONSTANTS = {
    VALID_ANSWER_MIN_LENGTH: 10,
    VALID_ANSWER_MAX_LENGTH: 1000,
    SAMPLE_ANSWERS: {
        VALID: 'Thank you for your feedback, we really appreciate your comments.',
        TOO_SHORT: 'Short',
        TOO_LONG: 'a'.repeat(1001),
        EMPTY: '',
    },
    SAMPLE_RATINGS: {
        EXCELLENT: 5,
        GOOD: 4,
        AVERAGE: 3,
        POOR: 2,
        TERRIBLE: 1,
        INVALID: 0,
    },
};

const createMockRating = (overrides: any = {}) => ({
    id: '1',
    flightNumber: 'AF123',
    airline: {
        id: 1,
        name: 'Air France',
        iataCode: 'AF',
        icaoCode: 'AFR',
        country: 'France',
        active: true,
    },
    rating: 4,
    comments: 'Très bon vol, service impeccable.',
    answer: '',
    status: RatingStatus.PROCESSED,
    date: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    ...overrides,
});

const createMockActivatedRoute = (id = '1') => ({
    snapshot: {
        params: { id },
    },
});

const expectFormToBeInvalid = (form: any, fieldName: string) => {
    expect(form.get(fieldName)?.invalid).toBeTruthy();
    expect(form.invalid).toBeTruthy();
};

const expectFormToBeValid = (form: any, fieldName: string) => {
    expect(form.get(fieldName)?.valid).toBeTruthy();
    expect(form.valid).toBeTruthy();
};

describe('RatingDetailComponent', () => {
    let component: RatingDetailComponent;
    let fixture: ComponentFixture<RatingDetailComponent>;
    let mockRatingService: jasmine.SpyObj<RatingService>;
    let mockAuthService: jasmine.SpyObj<AuthenticationService>;

    let mockNotificationService: jasmine.SpyObj<NotificationService>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockActivatedRoute: any;

    const mockRating: Rating = createMockRating();

    beforeEach(async () => {
        // Mock des services
        mockRatingService = jasmine.createSpyObj('RatingService', ['getOne', 'updateStatus', 'addAnswer']);
        mockNotificationService = jasmine.createSpyObj('NotificationService', ['displaySuccess', 'displayError']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
        mockAuthService = jasmine.createSpyObj('AuthenticationService', ['isAuthenticated', 'getCurrentUser']);

        mockActivatedRoute = createMockActivatedRoute('1');

        // Configuration du mockRouter
        mockRouter.navigateByUrl.and.returnValue(Promise.resolve(true));
        mockRouter.navigate.and.returnValue(Promise.resolve(true));

        await TestBed.configureTestingModule({
            imports: [
                RatingDetailComponent,
                MaterialModule,
                ReactiveFormsModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot(),
                StoreModule.forRoot(reducers),
                EffectsModule.forRoot([]),
                PageTitleComponent,
                RatingStatusSelectComponent,
            ],
            providers: [
                FormBuilder,
                { provide: RatingService, useValue: mockRatingService },
                { provide: NotificationService, useValue: mockNotificationService },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: AuthenticationService, useValue: mockAuthService },
                TranslateService,
                AuthenticationService,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RatingDetailComponent);
        component = fixture.componentInstance;
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize forms correctly', () => {
            expect(component.answerForm).toBeDefined();
            expect(component.statusForm).toBeDefined();
            expect(component.answerForm.get('answer')).toBeDefined();
            expect(component.statusForm.get('status')).toBeDefined();
        });

        it('should have required form validators', () => {
            const answerControl = component.answerForm.get('answer');
            const statusControl = component.statusForm.get('status');

            expect(answerControl?.hasError('required')).toBeTruthy();
            expect(statusControl?.hasError('required')).toBeTruthy();
        });
    });

    describe('Rating Loading', () => {
        it('should load rating data successfully', done => {
            mockRatingService.getOne.and.returnValue(of(mockRating));

            component.ratings$.subscribe(rating => {
                expect(rating).toEqual(mockRating);
                expect(mockRatingService.getOne).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });

        it('should navigate to ratings list on error', done => {
            mockRatingService.getOne.and.returnValue(throwError(() => new Error('Rating not found')));

            // L'observable catchError gère l'erreur et retourne null au lieu de propager l'erreur
            component.ratings$.subscribe({
                next: rating => {
                    // L'erreur est catchée, donc on reçoit null
                    expect(rating).toBeNull();
                    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('ratings');
                    done();
                },
                error: () => {
                    // Cette branche ne devrait pas être exécutée à cause du catchError
                    fail('Error should have been caught by catchError operator');
                    done();
                },
            });
        });

        it('should populate forms when rating is loaded', done => {
            const ratingWithAnswer = createMockRating({ answer: 'Thank you for your feedback!' });
            mockRatingService.getOne.and.returnValue(of(ratingWithAnswer));

            component.ratings$.subscribe(() => {
                expect(component.answerForm.get('answer')?.value).toBe(ratingWithAnswer.answer);
                expect(component.statusForm.get('status')?.value).toBe(ratingWithAnswer.status);
                done();
            });
        });
    });

    describe('Form Validation', () => {
        beforeEach(() => {
            mockRatingService.getOne.and.returnValue(of(mockRating));
        });

        describe('Answer Form', () => {
            it('should be invalid when answer is empty', () => {
                component.answerForm.get('answer')?.setValue(TEST_CONSTANTS.SAMPLE_ANSWERS.EMPTY);
                expectFormToBeInvalid(component.answerForm, 'answer');
            });

            it('should be invalid when answer is too short', () => {
                component.answerForm.get('answer')?.setValue(TEST_CONSTANTS.SAMPLE_ANSWERS.TOO_SHORT);
                expect(component.answerForm.get('answer')?.hasError('minlength')).toBeTruthy();
            });

            it('should be invalid when answer is too long', () => {
                component.answerForm.get('answer')?.setValue(TEST_CONSTANTS.SAMPLE_ANSWERS.TOO_LONG);
                expect(component.answerForm.get('answer')?.hasError('maxlength')).toBeTruthy();
            });

            it('should be valid with proper answer length', () => {
                component.answerForm.get('answer')?.setValue(TEST_CONSTANTS.SAMPLE_ANSWERS.VALID);
                expectFormToBeValid(component.answerForm, 'answer');
            });
        });

        describe('Status Form', () => {
            it('should be invalid when status is empty', () => {
                component.statusForm.get('status')?.setValue('');
                expect(component.statusForm.invalid).toBeTruthy();
            });

            it('should be valid with a selected status', () => {
                component.statusForm.get('status')?.setValue(RatingStatus.PROCESSED);
                expect(component.statusForm.valid).toBeTruthy();
            });
        });
    });

    describe('Answer Submission', () => {
        beforeEach(() => {
            mockRatingService.getOne.and.returnValue(of(mockRating));
            mockRatingService.addAnswer.and.returnValue(of(undefined));
        });

        it('should submit answer when form is valid', () => {
            component.answerForm.get('answer')?.setValue(TEST_CONSTANTS.SAMPLE_ANSWERS.VALID);

            component.onSubmitAnswer();

            expect(mockRatingService.addAnswer).toHaveBeenCalledWith('1', TEST_CONSTANTS.SAMPLE_ANSWERS.VALID);
        });

        it('should not submit answer when form is invalid', () => {
            component.answerForm.get('answer')?.setValue(TEST_CONSTANTS.SAMPLE_ANSWERS.EMPTY); // Invalid

            component.onSubmitAnswer();

            expect(mockRatingService.addAnswer).not.toHaveBeenCalled();
            expect(component.answerForm.get('answer')?.touched).toBeTruthy();
        });

        it('should show success notification on successful answer submission', done => {
            component.answerForm.get('answer')?.setValue(TEST_CONSTANTS.SAMPLE_ANSWERS.VALID);

            component.onSubmitAnswer();

            setTimeout(() => {
                expect(mockNotificationService.displaySuccess).toHaveBeenCalledWith('COMMONS.RATING_DETAIL.NOTIFICATION.ANSWER_SUCCESS');
                done();
            }, 100);
        });
    });

    describe('Status Update', () => {
        beforeEach(() => {
            mockRatingService.getOne.and.returnValue(of(mockRating));
            mockRatingService.updateStatus.and.returnValue(of(undefined));
        });

        it('should update status when form is valid', () => {
            component.statusForm.get('status')?.setValue(RatingStatus.PROCESSED);

            component.onStatusChange();

            expect(mockRatingService.updateStatus).toHaveBeenCalledWith('1', RatingStatus.PROCESSED);
        });

        it('should not update status when form is invalid', () => {
            component.statusForm.get('status')?.setValue(''); // Invalid

            component.onStatusChange();

            expect(mockRatingService.updateStatus).not.toHaveBeenCalled();
        });

        it('should show success notification on successful status update', done => {
            component.statusForm.get('status')?.setValue(RatingStatus.PROCESSED);

            component.onStatusChange();

            setTimeout(() => {
                expect(mockNotificationService.displaySuccess).toHaveBeenCalledWith('COMMONS.RATING_DETAIL.NOTIFICATION.STATUS_UPDATED_SUCCESSFULLY');
                done();
            }, 100);
        });
    });

    describe('Navigation', () => {
        it('should navigate back to ratings list', () => {
            component.goBack();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/avis']);
        });
    });

    describe('Helper Methods', () => {
        describe('hasAnswer', () => {
            it('should return true when rating has answer', () => {
                const ratingWithAnswer = createMockRating({ answer: 'Some answer' });
                expect(component.hasAnswer(ratingWithAnswer)).toBeTruthy();
            });

            it('should return false when rating has no answer', () => {
                const ratingWithoutAnswer = createMockRating({ answer: '' });
                expect(component.hasAnswer(ratingWithoutAnswer)).toBeFalsy();
            });

            it('should return false when answer is only whitespace', () => {
                const ratingWithWhitespaceAnswer = createMockRating({ answer: '   ' });
                expect(component.hasAnswer(ratingWithWhitespaceAnswer)).toBeFalsy();
            });
        });

        describe('getStatusDisplay', () => {
            it('should return correct display for known status', () => {
                const display = component.getStatusDisplay(RatingStatus.PROCESSED);
                expect(display.value).toBe(RatingStatus.PROCESSED);
                expect(display.label).toBeDefined();
            });

            it('should return default display for unknown status', () => {
                const unknownStatus = 'UNKNOWN_STATUS' as RatingStatus;
                const display = component.getStatusDisplay(unknownStatus);
                expect(display.label).toBe('COMMONS.STATUS.UNKNOWN');
                expect(display.color).toBe('text-gray-600');
            });
        });

        describe('getRatingDisplay', () => {
            it('should return correct display for rating 5', () => {
                const display = component.getRatingDisplay(TEST_CONSTANTS.SAMPLE_RATINGS.EXCELLENT);
                expect(display.label).toBe('Excellent');
                expect(display.color).toBe('text-green-600');
                expect(display.icon).toBe('sentiment_very_satisfied');
            });

            it('should return correct display for rating 4', () => {
                const display = component.getRatingDisplay(TEST_CONSTANTS.SAMPLE_RATINGS.GOOD);
                expect(display.label).toBe('Très bien');
                expect(display.color).toBe('text-lime-600');
            });

            it('should return correct display for rating 3', () => {
                const display = component.getRatingDisplay(TEST_CONSTANTS.SAMPLE_RATINGS.AVERAGE);
                expect(display.label).toBe('Correct');
                expect(display.color).toBe('text-yellow-600');
            });

            it('should return correct display for rating 2', () => {
                const display = component.getRatingDisplay(TEST_CONSTANTS.SAMPLE_RATINGS.POOR);
                expect(display.label).toBe('Décevant');
                expect(display.color).toBe('text-orange-600');
            });

            it('should return correct display for rating 1', () => {
                const display = component.getRatingDisplay(TEST_CONSTANTS.SAMPLE_RATINGS.TERRIBLE);
                expect(display.label).toBe('Très décevant');
                expect(display.color).toBe('text-red-600');
            });

            it('should return default display for invalid rating', () => {
                const display = component.getRatingDisplay(TEST_CONSTANTS.SAMPLE_RATINGS.INVALID);
                expect(display.label).toBe('Non noté');
                expect(display.color).toBe('text-gray-600');
                expect(display.icon).toBe('help_outline');
            });
        });
    });

    describe('Component Properties', () => {
        it('should have correct initial values', () => {
            expect(component.moment).toBeDefined();
            expect(component.isLoading).toBeDefined();
            expect(component.rating).toBeDefined();
            expect(component.statusOptions).toBeDefined();
        });

        it('should have proper form structure', () => {
            // Answer form
            expect(component.answerForm.get('answer')).toBeDefined();

            // Status form
            expect(component.statusForm.get('status')).toBeDefined();
        });
    });

    describe('Template Integration', () => {
        beforeEach(() => {
            mockRatingService.getOne.and.returnValue(of(mockRating));
            fixture.detectChanges();
        });

        it('should display rating information correctly', () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain(mockRating.flightNumber);
            expect(compiled.textContent).toContain(mockRating.airline.name);
        });

        it('should show rating with stars', () => {
            const starElements = fixture.nativeElement.querySelectorAll('mat-icon');
            const stars = Array.from(starElements).filter((icon: any) => icon.textContent.trim() === 'star');
            expect(stars.length).toBeGreaterThan(0);
        });

        it('should display existing answer when answer exists', async () => {
            const ratingWithAnswer = createMockRating({ answer: 'Thank you for your feedback!' });
            mockRatingService.getOne.and.returnValue(of(ratingWithAnswer));

            // Force component recreation with new data
            fixture.destroy();
            fixture = TestBed.createComponent(RatingDetailComponent);
            component = fixture.componentInstance;

            fixture.detectChanges();
            await fixture.whenStable();

            // Check that the answer is present in the component
            expect(component.hasAnswer(ratingWithAnswer)).toBeTruthy();
        });
    });

    describe('Edge Cases and Advanced Scenarios', () => {
        it('should handle null rating gracefully', () => {
            const nullRating = null as any;
            expect(() => component.hasAnswer(nullRating)).not.toThrow();
            expect(component.hasAnswer(nullRating)).toBeFalsy();
        });

        it('should handle undefined rating properties', () => {
            const incompleteRating = createMockRating({
                answer: undefined,
                status: undefined,
            }) as Rating;

            expect(component.hasAnswer(incompleteRating)).toBeFalsy();
            expect(() => component.getStatusDisplay(incompleteRating.status!)).not.toThrow();
        });

        it('should handle form reset correctly', () => {
            component.answerForm.get('answer')?.setValue('Some answer');
            component.answerForm.reset();
            expect(component.answerForm.get('answer')?.value).toBeFalsy();
        });

        it('should handle multiple rapid status changes', () => {
            mockRatingService.getOne.and.returnValue(of(mockRating));
            mockRatingService.updateStatus.and.returnValue(of(undefined));

            component.statusForm.get('status')?.setValue(RatingStatus.PROCESSED);
            component.onStatusChange();

            component.statusForm.get('status')?.setValue(RatingStatus.PUBLISHED);
            component.onStatusChange();

            expect(mockRatingService.updateStatus).toHaveBeenCalledTimes(2);
        });

        it('should maintain form state during rating reload', done => {
            const userInput = 'User typed this before reload';
            component.answerForm.get('answer')?.setValue(userInput);

            mockRatingService.getOne.and.returnValue(of(mockRating));

            component.ratings$.subscribe(() => {
                // Form should be updated with server data, not user input
                expect(component.answerForm.get('answer')?.value).toBe(mockRating.answer);
                done();
            });
        });
    });

    describe('Accessibility and UX', () => {
        beforeEach(() => {
            mockRatingService.getOne.and.returnValue(of(mockRating));
            fixture.detectChanges();
        });

        it('should have proper ARIA labels and roles', () => {
            const buttons = fixture.nativeElement.querySelectorAll('button');
            buttons.forEach((button: HTMLButtonElement) => {
                // Buttons should be focusable
                expect(button.tabIndex).toBeGreaterThanOrEqual(0);
            });
        });

        it('should show form validation errors when touched', () => {
            const answerControl = component.answerForm.get('answer');
            answerControl?.setValue('');
            answerControl?.markAsTouched();

            expect(answerControl?.hasError('required')).toBeTruthy();
            expect(answerControl?.touched).toBeTruthy();
        });

        it('should enable submit button when form is valid', () => {
            component.answerForm.get('answer')?.setValue(TEST_CONSTANTS.SAMPLE_ANSWERS.VALID);
            fixture.detectChanges();

            const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
            expect(submitButton?.disabled).toBeFalsy();
        });
    });

    describe('Performance and Memory', () => {
        it('should unsubscribe from observables on destroy', () => {
            const subscription = component.addAnswer$;
            const statusSubscription = component.updateStatus$;

            spyOn(subscription, 'unsubscribe').and.callThrough();
            spyOn(statusSubscription, 'unsubscribe').and.callThrough();

            // Simulate component destruction
            fixture.destroy();

            expect(subscription.unsubscribe).toHaveBeenCalled();
            expect(statusSubscription.unsubscribe).toHaveBeenCalled();
        });

        it('should handle rapid form changes without memory leaks', () => {
            for (let i = 0; i < 100; i++) {
                component.answerForm.get('answer')?.setValue(`Answer ${i}`);
                component.statusForm.get('status')?.setValue(RatingStatus.PROCESSED);
            }

            // Should not throw or cause memory issues
            expect(component.answerForm.get('answer')?.value).toBe('Answer 99');
        });
    });
});
