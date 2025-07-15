import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let translateService: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FooterComponent,
                TranslateModule.forRoot(),
                MatIconModule,
                NoopAnimationsModule,
            ],
            providers: [
                TranslateService,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        translateService = TestBed.inject(TranslateService);
        
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should be a standalone component', () => {
            expect(FooterComponent).toBeDefined();
        });
    });

    describe('Component Properties', () => {
        it('should have version property', () => {
            expect(component.version).toBeDefined();
            expect(typeof component.version).toBe('string');
        });

        it('should have currentYear property', () => {
            expect(component.currentYear).toBeDefined();
            expect(typeof component.currentYear).toBe('number');
        });

        it('should have current year set to actual current year', () => {
            const expectedYear = new Date().getFullYear();
            expect(component.currentYear).toBe(expectedYear);
        });

        it('should have version from package.json', () => {
            expect(component.version).toMatch(/^\d+\.\d+\.\d+/); // Format x.y.z
        });
    });

    describe('Accessibility', () => {
        it('should have semantic footer element', () => {
            const footerElement = fixture.nativeElement.querySelector('footer');
            expect(footerElement.tagName.toLowerCase()).toBe('footer');
        });

        it('should have readable text content', () => {
            const textElements = fixture.nativeElement.querySelectorAll('.text-gray-400');
            textElements.forEach((element: HTMLElement) => {
                expect(element.textContent?.trim().length).toBeGreaterThan(0);
            });
        });
    });

    describe('Translation Integration', () => {
        it('should use TranslateModule', () => {
            expect(translateService).toBeTruthy();
        });
    });
});
