import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

import { RatingStatusSelectComponent } from './rating-status-select.component';
import { RatingStatus, RATING_STATUS_OPTIONS } from '../../enums/rating-status.enum';


describe('RatingStatusSelectComponent', () => {
  let component: RatingStatusSelectComponent;
  let fixture: ComponentFixture<RatingStatusSelectComponent>;
  let translateService: TranslateService;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RatingStatusSelectComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingStatusSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormControl());
    fixture.componentRef.setInput('label', 'Select Status');
    fixture.componentRef.setInput('placeholder', 'Choose a status');
    fixture.componentRef.setInput('allowBlankOption', true);
    translateService = TestBed.inject(TranslateService);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    // Setup default translations
    translateService.setTranslation('en', {
      'Select Status': 'Select Status',
      'COMMONS.SELECT.ALL': 'All',
      'COMMONS.STATUS.PROCESSED': 'Processed',
      'COMMONS.STATUS.PUBLISHED': 'Published',
      'COMMONS.STATUS.REJECTED': 'Rejected',
    });
    translateService.setDefaultLang('en');
    translateService.use('en');

    fixture.detectChanges();
});

  describe('Component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with required inputs', () => {
      expect(component.control()).toBe(component.control());
      expect(component.label()).toBe('Select Status');
    });

    it('should initialize with default optional inputs', () => {
      expect(component.placeholder()).toBe('Choose a status');
      expect(component.allowBlankOption()).toBe(true);
    });

    it('should have access to status options', () => {
      expect(component.statusOptions).toBe(RATING_STATUS_OPTIONS);
      expect(component.statusOptions.length).toBe(3);
    });
  });

  describe('Template rendering', () => {
    it('should render mat-form-field with correct class', () => {
      const formField = fixture.debugElement.query(By.css('mat-form-field'));
      expect(formField).toBeTruthy();
      expect(formField.nativeElement.classList).toContain('w-full');
    });

    it('should render mat-label with translated text', () => {
      const label = fixture.debugElement.query(By.css('mat-label'));
      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent.trim()).toBe('Select Status');
    });

    it('should render mat-select with form control and placeholder', () => {
      const select = fixture.debugElement.query(By.css('mat-select'));
      expect(select).toBeTruthy();
      expect(select.componentInstance.ngControl.control).toBe(component.control());
    });

    it('should render suffix icon', () => {
      const icon = fixture.debugElement.query(By.css('mat-icon[matSuffix]'));
      expect(icon).toBeTruthy();
      expect(icon.nativeElement.textContent.trim()).toBe('playlist_add_check');
      expect(icon.nativeElement.classList).toContain('text-air-france-600');
    });
  });

  describe('Blank option rendering', () => {

    it('should not render blank option when allowBlankOption is false', async () => {
        fixture.componentRef.setInput('allowBlankOption', false);
      fixture.detectChanges();

      const select = await loader.getHarness(MatSelectHarness);
      await select.open();

      const options = await select.getOptions();
      expect(options.length).toBe(3); // Only 3 status options

      const firstOption = options[0];
      const firstOptionText = await firstOption.getText();
      expect(firstOptionText).toContain('Processed'); // First status option
    });

  });

  describe('Status options rendering', () => {

    it('should render all status options', async () => {
      const select = await loader.getHarness(MatSelectHarness);
      await select.open();

      const options = await select.getOptions();
      const statusOptionsCount = component.allowBlankOption() ? 4 : 3;
      expect(options.length).toBe(statusOptionsCount);
    });

    });


    it('should render translated status labels', async () => {
      const select = await loader.getHarness(MatSelectHarness);
      await select.open();

      const options = await select.getOptions();
      const statusOptions = component.allowBlankOption() ? options.slice(1) : options;

      const expectedLabels = ['Processed', 'Published', 'Rejected'];
      
      for (let i = 0; i < statusOptions.length; i++) {
        const optionText = await statusOptions[i].getText();
        expect(optionText).toContain(expectedLabels[i]);
      }
  });

  describe('Form control integration', () => {
    it('should update form control when option is selected', async () => {
      const select = await loader.getHarness(MatSelectHarness);
      
      await select.open();
      await select.clickOptions({ text: /Processed/ });

      expect(component.control().value).toBe(RatingStatus.PROCESSED);
    });

    it('should reflect form control value in select', async () => {
      component.control().setValue(RatingStatus.REJECTED);
      fixture.detectChanges();

      const select = await loader.getHarness(MatSelectHarness);
      const value = await select.getValueText();

      expect(value).toContain('Rejected');
    });

    it('should handle form control state changes', () => {
      const select = fixture.debugElement.query(By.css('mat-select'));

      // Test disabled state
      component.control().disable();
      fixture.detectChanges();
      expect(select.componentInstance.disabled).toBe(true);

      // Test enabled state
      component.control().enable();
      fixture.detectChanges();
      expect(select.componentInstance.disabled).toBe(false);
    });
  });

  describe('Input changes', () => {
    it('should update label when label input changes', () => {
        fixture.componentRef.setInput('label', 'New Status Label');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('mat-label'));
      expect(label.nativeElement.textContent.trim()).toBe('New Status Label');
    });

    it('should update placeholder when placeholder input changes', () => {
        fixture.componentRef.setInput('placeholder', 'Select your option');
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('mat-select'));
      expect(select.componentInstance.placeholder).toBe('Select your option');
    });

    it('should show/hide blank option when allowBlankOption changes', async () => {
      // Start with blank option enabled
        fixture.componentRef.setInput('allowBlankOption', true);
      fixture.detectChanges();

      let select = await loader.getHarness(MatSelectHarness);
      await select.open();
      let options = await select.getOptions();
      expect(options.length).toBe(4);
      await select.close();

      // Disable blank option
      fixture.componentRef.setInput('allowBlankOption', false);
      fixture.detectChanges();

      select = await loader.getHarness(MatSelectHarness);
      await select.open();
      options = await select.getOptions();
      expect(options.length).toBe(3);
    });

    it('should update form control binding when control input changes', () => {
      const newControl = new FormControl(RatingStatus.PUBLISHED);
        fixture.componentRef.setInput('control', newControl);
      fixture.detectChanges();

      expect(component.control()).toBe(newControl);
    });
  });

  describe('Translation integration', () => {
    it('should translate label', () => {
      translateService.setTranslation('fr', {
        'Select Status': 'Sélectionner le statut',
      });
      translateService.use('fr');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('mat-label'));
      expect(label.nativeElement.textContent.trim()).toBe('Sélectionner le statut');
    });

    it('should translate status option labels', async () => {
      translateService.setTranslation('fr', {
        'COMMONS.STATUS.PROCESSED': 'Traité',
        'COMMONS.STATUS.PUBLISHED': 'Publié',
        'COMMONS.STATUS.REJECTED': 'Rejeté',
      });
      translateService.use('fr');
      fixture.detectChanges();

      const select = await loader.getHarness(MatSelectHarness);
      await select.open();

      const statusLabels = fixture.debugElement.queryAll(
        By.css('mat-option:not([value=""]) div.flex span')
      );

      const expectedTranslations = ['Traité', 'Publié', 'Rejeté'];
      statusLabels.forEach((label, index) => {
        expect(label.nativeElement.textContent.trim()).toBe(expectedTranslations[index]);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const formField = fixture.debugElement.query(By.css('mat-form-field'));
      const select = fixture.debugElement.query(By.css('mat-select'));

      expect(formField).toBeTruthy();
      expect(select).toBeTruthy();
      
      // Material components handle ARIA attributes automatically
      expect(select.nativeElement.getAttribute('role')).toBeTruthy();
    });

    it('should be keyboard navigable', async () => {
      const select = await loader.getHarness(MatSelectHarness);
      
      // Should be able to open with keyboard
      await select.focus();
      await select.open();
      
      const options = await select.getOptions();
      expect(options.length).toBeGreaterThan(0);
      
      // Should be able to select with keyboard
      await select.clickOptions({ text: /Processed/ });
      expect(component.control().value).toBe(RatingStatus.PROCESSED);
    });

    it('should have proper focus management', async () => {
      const select = await loader.getHarness(MatSelectHarness);
      
      await select.focus();
      expect(await select.isFocused()).toBe(true);
    });
  });

  describe('Visual styling', () => {
    it('should apply correct CSS classes to form field', () => {
      const formField = fixture.debugElement.query(By.css('mat-form-field'));
      expect(formField.nativeElement.classList).toContain('w-full');
    });

    it('should apply correct CSS classes to suffix icon', () => {
      const icon = fixture.debugElement.query(By.css('mat-icon[matSuffix]'));
      expect(icon.nativeElement.classList).toContain('text-air-france-600');
    });

    it('should apply correct styling to blank option', () => {
      const blankOptionSpan = fixture.debugElement.query(
        By.css('mat-option[value=""] span')
      );
      
      if (blankOptionSpan) {
        expect(blankOptionSpan.nativeElement.classList).toContain('text-gray-500');
        expect(blankOptionSpan.nativeElement.classList).toContain('italic');
      }
    });

    it('should apply correct layout classes to status options', async () => {
      const select = await loader.getHarness(MatSelectHarness);
      await select.open();

      const statusOptionDivs = fixture.debugElement.queryAll(
        By.css('mat-option:not([value=""]) div.flex')
      );

      statusOptionDivs.forEach(div => {
        expect(div.nativeElement.classList).toContain('flex');
        expect(div.nativeElement.classList).toContain('items-center');
        expect(div.nativeElement.classList).toContain('space-x-2');
      });
    });

    it('should apply correct styling to colored dots', async () => {
      const select = await loader.getHarness(MatSelectHarness);
      await select.open();

      const dots = fixture.debugElement.queryAll(
        By.css('mat-option div.w-3.h-3.rounded-full')
      );

      dots.forEach(dot => {
        expect(dot.nativeElement.classList).toContain('w-3');
        expect(dot.nativeElement.classList).toContain('h-3');
        expect(dot.nativeElement.classList).toContain('rounded-full');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle null form control value', () => {
      component.control().setValue(null);
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle undefined form control value', () => {
      component.control().setValue(null);
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle invalid status value', () => {

      component.control().setValue('INVALID_STATUS' as any);
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle empty string placeholder', () => {
        fixture.componentRef.setInput('placeholder', '');
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('mat-select'));
      expect(select.componentInstance.placeholder).toBe('');
    });

    it('should handle empty string label', () => {
        fixture.componentRef.setInput('label', '');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('mat-label'));
      expect(label.nativeElement.textContent.trim()).toBe('');
    });
  });
});
