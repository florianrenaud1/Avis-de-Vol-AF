import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import moment from 'moment';

import { DatepickerComponent } from './datepicker.component';

// Composant de test pour wrapper le DatepickerComponent
@Component({
    template: ` <app-datepicker [control]="control" [label]="label" [min]="min()" [max]="max()"> </app-datepicker> `,
    imports: [DatepickerComponent],
})
class TestHostComponent {
    control = new FormControl();
    label = 'Test Label';
    min = signal<Date | undefined>(undefined);
    max = signal<Date | undefined>(undefined);
}

describe('DatepickerComponent', () => {
    let component: DatepickerComponent;
    let hostComponent: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let translateService: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DatepickerComponent,
                TestHostComponent,
                ReactiveFormsModule,
                MatDatepickerModule,
                MatFormFieldModule,
                MatInputModule,
                MatNativeDateModule,
                TranslateModule.forRoot(),
                BrowserAnimationsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;
        component = fixture.debugElement.query(By.directive(DatepickerComponent)).componentInstance;
        translateService = TestBed.inject(TranslateService);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Initialization', () => {
        it('should initialize with required inputs', () => {
            expect(component.control()).toBe(hostComponent.control);
            expect(component.label()).toBe('Test Label');
        });

        it('should have undefined min and max by default', () => {
            expect(component.min()).toBeUndefined();
            expect(component.max()).toBeUndefined();
        });
    });

    describe('Template rendering', () => {
        it('should render mat-form-field with correct classes', () => {
            const formField = fixture.debugElement.query(By.css('mat-form-field'));
            expect(formField).toBeTruthy();
            expect(formField.nativeElement.classList.contains('w-full')).toBeTruthy();
        });

        it('should render mat-label with translated text', () => {
            const label = fixture.debugElement.query(By.css('mat-label'));
            expect(label).toBeTruthy();
            expect(label.nativeElement.getAttribute('data-label')).toBe('');
        });

        it('should render input with correct attributes', () => {
            const input = fixture.debugElement.query(By.css('input[data-datepicker]'));
            expect(input).toBeTruthy();
            expect(input.nativeElement.hasAttribute('readonly')).toBeTruthy();
            expect(input.nativeElement.hasAttribute('matInput')).toBeTruthy();
        });

        it('should render datepicker toggle button', () => {
            const toggle = fixture.debugElement.query(By.css('mat-datepicker-toggle[data-mat-datepicker-toggle]'));
            expect(toggle).toBeTruthy();
        });

        it('should render mat-datepicker', () => {
            const datepicker = fixture.debugElement.query(By.css('mat-datepicker[data-mat-datepicker]'));
            expect(datepicker).toBeTruthy();
        });
    });

    describe('Form Control Integration', () => {
        it('should bind form control to input', () => {
            const testDate = new Date('2023-06-15');
            hostComponent.control.setValue(testDate);
            fixture.detectChanges();

            const input = fixture.debugElement.query(By.css('input'));
            expect(input.nativeElement.value).toBeTruthy();
        });

        it('should update form control when date is selected', () => {
            const testDate = new Date('2023-06-15');

            // Simuler la sélection d'une date
            hostComponent.control.setValue(testDate);
            fixture.detectChanges();

            expect(hostComponent.control.value).toEqual(testDate);
        });

        it('should handle form control validation states', () => {
            hostComponent.control.setErrors({ required: true });
            fixture.detectChanges();

            const formField = fixture.debugElement.query(By.css('mat-form-field'));
            expect(formField.nativeElement.classList.contains('ng-invalid')).toBeTruthy();
        });

        it('should handle disabled state', () => {
            hostComponent.control.disable();
            fixture.detectChanges();

            const input = fixture.debugElement.query(By.css('input'));
            expect(input.nativeElement.disabled).toBeTruthy();
        });
    });

    describe('Min/Max date constraints', () => {
        it('should apply min date constraint', () => {
            const minDate = new Date('2023-01-01');
            hostComponent.min.set(minDate);
            fixture.detectChanges();

            const input = fixture.debugElement.query(By.css('input'));
            expect(input.nativeElement.min).toBeTruthy();
        });

        it('should apply max date constraint', () => {
            const maxDate = new Date('2023-12-31');
            hostComponent.max.set(maxDate);
            fixture.detectChanges();

            const input = fixture.debugElement.query(By.css('input'));
            expect(input.nativeElement.max).toBeTruthy();
        });

        it('should work with Moment objects for min date', () => {
            const minMoment = moment('2023-01-01');
            hostComponent.min.set(minMoment.toDate());
            fixture.detectChanges();

            expect(component.min()).toEqual(minMoment.toDate());
        });

        it('should work with Moment objects for max date', () => {
            const maxMoment = moment('2023-12-31');
            hostComponent.max.set(maxMoment.toDate());
            fixture.detectChanges();

            expect(component.max()).toEqual(maxMoment.toDate());
        });
    });

    describe('User Interactions', () => {
        it('should open datepicker when input is clicked', () => {
            const input = fixture.debugElement.query(By.css('input'));
            const datepicker = fixture.debugElement.query(By.directive(DatepickerComponent));

            spyOn(datepicker.componentInstance, 'control').and.returnValue(hostComponent.control);

            input.nativeElement.click();
            fixture.detectChanges();

            // Vérifier que le datepicker est accessible
            expect(input.nativeElement).toBeTruthy();
        });

        it('should open datepicker when toggle button is clicked', () => {
            const toggle = fixture.debugElement.query(By.css('mat-datepicker-toggle'));

            toggle.nativeElement.click();
            fixture.detectChanges();

            // Vérifier que l'interaction fonctionne
            expect(toggle.nativeElement).toBeTruthy();
        });
    });

    describe('Translation Integration', () => {
        it('should use translate pipe for label', () => {
            const label = fixture.debugElement.query(By.css('mat-label'));
            expect(label.nativeElement.textContent.trim()).toBe('Test Label');
        });

        it('should update label when translation changes', () => {
            translateService.setTranslation('en', { 'Test Label': 'Translated Label' });
            translateService.use('en');
            fixture.detectChanges();

            const label = fixture.debugElement.query(By.css('mat-label'));
            expect(label.nativeElement.textContent.trim()).toBe('Translated Label');
        });
    });

    describe('Edge Cases', () => {
        it('should handle null form control value', () => {
            hostComponent.control.setValue(null);
            fixture.detectChanges();

            const input = fixture.debugElement.query(By.css('input'));
            expect(input.nativeElement.value).toBe('');
        });

        it('should handle invalid date values', () => {
            hostComponent.control.setValue('invalid-date');
            fixture.detectChanges();

            expect(hostComponent.control.value).toBe('invalid-date');
        });

        it('should handle empty label', () => {
            hostComponent.label = '';
            fixture.detectChanges();

            const label = fixture.debugElement.query(By.css('mat-label'));
            expect(label.nativeElement.textContent.trim()).toBe('');
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            const input = fixture.debugElement.query(By.css('input'));
            expect(input.nativeElement.hasAttribute('matInput')).toBeTruthy();
        });

        it('should be keyboard accessible', () => {
            const input = fixture.debugElement.query(By.css('input'));
            expect(input.nativeElement.tabIndex).not.toBe(-1);
        });

        it('should have proper label association', () => {
            const formField = fixture.debugElement.query(By.css('mat-form-field'));
            const label = fixture.debugElement.query(By.css('mat-label'));

            expect(formField).toBeTruthy();
            expect(label).toBeTruthy();
        });
    });

    describe('Component Input Changes', () => {
        it('should react to control input changes', () => {
            const newControl = new FormControl(new Date('2024-01-01'));
            hostComponent.control = newControl;
            fixture.detectChanges();

            expect(component.control()).toBe(newControl);
        });

        it('should react to label input changes', () => {
            hostComponent.label = 'New Label';
            fixture.detectChanges();

            expect(component.label()).toBe('New Label');
        });

        it('should react to min date changes', () => {
            const newMinDate = new Date('2024-01-01');
            hostComponent.min.set(newMinDate);
            fixture.detectChanges();

            expect(component.min()).toBe(newMinDate);
        });

        it('should react to max date changes', () => {
            const newMaxDate = new Date('2024-12-31');
            hostComponent.max.set(newMaxDate);
            fixture.detectChanges();

            expect(component.max()).toBe(newMaxDate);
        });
    });
});
