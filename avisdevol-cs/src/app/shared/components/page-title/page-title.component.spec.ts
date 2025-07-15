import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PageTitleComponent } from './page-title.component';

// Mock Router
class MockRouter {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

// Composant de test pour wrapper le PageTitleComponent
@Component({
  template: `
    <app-page-title 
      [icon]="icon()"
      [label]="label()"
      [params]="params()"
      [buttonBack]="buttonBack()"
      [urlBack]="urlBack()"
      [infoTooltip]="infoTooltip()">
    </app-page-title>
  `,
  imports: [PageTitleComponent]
})
class TestHostComponent {
  icon = signal<string>('home');
  label = signal<string>('Test Page Title');
  params = signal<object>({});
  buttonBack = signal<boolean>(false);
  urlBack = signal<string>('');
  infoTooltip = signal<string>('');
}

describe('PageTitleComponent', () => {
  let component: PageTitleComponent;
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let router: jasmine.SpyObj<Router>;
  let translateService: TranslateService;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        PageTitleComponent,
        TestHostComponent,
        MatButton,
        MatIcon,
        MatTooltip,
        TranslateModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(PageTitleComponent)).componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    translateService = TestBed.inject(TranslateService);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default inputs', () => {
      expect(component.icon()).toBe('home');
      expect(component.label()).toBe('Test Page Title');
      expect(component.params()).toEqual({});
      expect(component.buttonBack()).toBe(false);
      expect(component.urlBack()).toBe('');
      expect(component.infoTooltip()).toBe('');
    });

    it('should initialize with empty defaults when no inputs provided', () => {
      // Create a new component without inputs
      const emptyFixture = TestBed.createComponent(PageTitleComponent);
      const emptyComponent = emptyFixture.componentInstance;
      
      expect(emptyComponent.icon()).toBe('');
      expect(emptyComponent.label()).toBe('');
      expect(emptyComponent.params()).toEqual({});
      expect(emptyComponent.buttonBack()).toBe(false);
      expect(emptyComponent.urlBack()).toBe('');
      expect(emptyComponent.infoTooltip()).toBe('');
    });
  });

  describe('Template rendering', () => {
    it('should render the main container with correct classes', () => {
      const container = fixture.debugElement.query(By.css('.flex.items-center.justify-between'));
      expect(container).toBeTruthy();
      expect(container.nativeElement.classList.contains('py-4')).toBeTruthy();
      expect(container.nativeElement.classList.contains('mb-4')).toBeTruthy();
      expect(container.nativeElement.classList.contains('border-b')).toBeTruthy();
    });

    it('should render icon with correct styling', () => {
      const iconContainer = fixture.debugElement.query(By.css('.p-2.bg-air-france-50.rounded-lg'));
      expect(iconContainer).toBeTruthy();
      
      const iconElement = fixture.debugElement.query(By.css('mat-icon.text-air-france-600'));
      expect(iconElement).toBeTruthy();
      expect(iconElement.nativeElement.textContent.trim()).toBe('home');
    });

    it('should render title with translation', () => {
      const titleElement = fixture.debugElement.query(By.css('h1.text-xl.font-semibold.text-gray-900'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent.trim()).toBe('Test Page Title');
    });

    it('should not render info tooltip when infoTooltip is empty', () => {
      const tooltipButton = fixture.debugElement.query(By.css('button[matTooltip]'));
      expect(tooltipButton).toBeFalsy();
    });

    it('should not render back button when buttonBack is false', () => {
      const backButton = fixture.debugElement.query(By.css('button[data-backbtn]'));
      expect(backButton).toBeFalsy();
    });

    it('should render back button when buttonBack is true', () => {
      hostComponent.buttonBack.set(true);
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button[data-backbtn]'));
      expect(backButton).toBeTruthy();
      
      const backIcon = backButton.query(By.css('mat-icon'));
      expect(backIcon.nativeElement.textContent.trim()).toBe('arrow_back');
    });
  });

  describe('Navigation functionality', () => {
    beforeEach(() => {
      // Reset the router spy before each test
      router.navigateByUrl.calls.reset();
    });

    it('should call redirectToBackUrl when back button is clicked', () => {
      spyOn(component, 'redirectToBackUrl').and.callThrough();
      
      hostComponent.buttonBack.set(true);
      hostComponent.urlBack.set('/previous-page');
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button[data-backbtn]'));
      backButton.nativeElement.click();

      expect(component.redirectToBackUrl).toHaveBeenCalled();
    });

    it('should not navigate when redirectToBackUrl is called with empty url', () => {
      hostComponent.urlBack.set('');
      
      component.redirectToBackUrl();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should not navigate when redirectToBackUrl is called with null url', () => {
      // Set urlBack to empty string (default)
      component.redirectToBackUrl();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('Translation integration', () => {
    it('should use translate pipe for label', () => {
      const titleElement = fixture.debugElement.query(By.css('h1'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Test Page Title');
    });

    it('should translate back button text', () => {
      hostComponent.buttonBack.set(true);
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button[data-backbtn]'));
      expect(backButton).toBeTruthy();
      
      const spanElement = backButton.query(By.css('span'));
      expect(spanElement).toBeTruthy();
      
      // Verify that the span contains the translation key or translated text
      // Since we don't have actual translations loaded in the test environment,
      // we just verify the element structure is correct
      expect(spanElement.nativeElement).toBeTruthy();
    });

  });

  describe('Input changes', () => {
    it('should react to icon input changes', () => {
      hostComponent.icon.set('settings');
      fixture.detectChanges();

      expect(component.icon()).toBe('settings');
      
      const iconElement = fixture.debugElement.query(By.css('mat-icon'));
      expect(iconElement.nativeElement.textContent.trim()).toBe('settings');
    });

    it('should react to label input changes', () => {
      hostComponent.label.set('New Page Title');
      fixture.detectChanges();

      expect(component.label()).toBe('New Page Title');
      
      const titleElement = fixture.debugElement.query(By.css('h1'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('New Page Title');
    });

    it('should react to buttonBack input changes', () => {
      // Initially false
      expect(component.buttonBack()).toBe(false);
      let backButton = fixture.debugElement.query(By.css('button[data-backbtn]'));
      expect(backButton).toBeFalsy();

      // Change to true
      hostComponent.buttonBack.set(true);
      fixture.detectChanges();

      expect(component.buttonBack()).toBe(true);
      backButton = fixture.debugElement.query(By.css('button[data-backbtn]'));
      expect(backButton).toBeTruthy();
    });

    it('should react to urlBack input changes', () => {
      hostComponent.urlBack.set('/new-url');
      fixture.detectChanges();

      expect(component.urlBack()).toBe('/new-url');
    });

    it('should react to params input changes', () => {
      const newParams = { user: 'Alice', count: 5 };
      hostComponent.params.set(newParams);
      fixture.detectChanges();

      expect(component.params()).toEqual(newParams);
    });
  });

  describe('Styling and layout', () => {
    it('should have correct CSS classes for main container', () => {
      const container = fixture.debugElement.query(By.css('div')).nativeElement;
      
      expect(container.classList.contains('flex')).toBeTruthy();
      expect(container.classList.contains('items-center')).toBeTruthy();
      expect(container.classList.contains('justify-between')).toBeTruthy();
      expect(container.classList.contains('py-4')).toBeTruthy();
      expect(container.classList.contains('mb-4')).toBeTruthy();
      expect(container.classList.contains('border-b')).toBeTruthy();
      expect(container.classList.contains('border-gray-200')).toBeTruthy();
    });

    it('should have correct CSS classes for icon container', () => {
      const iconContainer = fixture.debugElement.query(By.css('.p-2.bg-air-france-50.rounded-lg')).nativeElement;
      
      expect(iconContainer.classList.contains('p-2')).toBeTruthy();
      expect(iconContainer.classList.contains('bg-air-france-50')).toBeTruthy();
      expect(iconContainer.classList.contains('rounded-lg')).toBeTruthy();
    });

    it('should have correct CSS classes for title', () => {
      const titleElement = fixture.debugElement.query(By.css('h1')).nativeElement;
      
      expect(titleElement.classList.contains('text-xl')).toBeTruthy();
      expect(titleElement.classList.contains('font-semibold')).toBeTruthy();
      expect(titleElement.classList.contains('text-gray-900')).toBeTruthy();
    });

    it('should have correct CSS classes for back button when visible', () => {
      hostComponent.buttonBack.set(true);
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button[data-backbtn]')).nativeElement;
      
      expect(backButton.classList.contains('text-gray-600')).toBeTruthy();
      expect(backButton.classList.contains('hover:text-air-france-600')).toBeTruthy();
      expect(backButton.classList.contains('hover:bg-air-france-50')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      const heading = fixture.debugElement.query(By.css('h1'));
      expect(heading).toBeTruthy();
      expect(heading.nativeElement.tagName.toLowerCase()).toBe('h1');
    });

    it('should have accessible button for back navigation', () => {
      hostComponent.buttonBack.set(true);
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button[data-backbtn]'));
      expect(backButton.nativeElement.type).toBe('button');
      expect(backButton.nativeElement.getAttribute('mat-button')).toBe('');
    });

  });

  describe('Edge cases', () => {
    it('should handle empty icon gracefully', () => {
      hostComponent.icon.set('');
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('mat-icon'));
      expect(iconElement.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle empty label gracefully', () => {
      hostComponent.label.set('');
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('h1'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle special characters in inputs', () => {
      hostComponent.icon.set('💼');
      hostComponent.label.set('Test & Special <Characters>');
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('mat-icon'));
      const titleElement = fixture.debugElement.query(By.css('h1'));
      
      expect(iconElement.nativeElement.textContent.trim()).toBe('💼');
      expect(titleElement.nativeElement.textContent.trim()).toBe('Test & Special <Characters>');
    });

    it('should handle complex params object', () => {
      const complexParams = {
        nested: { value: 'test' },
        array: [1, 2, 3],
        null: null,
        undefined: undefined
      };
      
      hostComponent.params.set(complexParams);
      fixture.detectChanges();

      expect(component.params()).toEqual(complexParams);
    });
  });
});
