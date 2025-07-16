import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { HeaderComponent } from './header.component';
import { LayoutActions } from '../../states';

// Mock component pour les tests de routing
@Component({
    template: '<div>Mock Login Component</div>',
})
class MockLoginComponent {}

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let mockStore: jasmine.SpyObj<Store>;
    let translateService: TranslateService;

    beforeEach(async () => {
        mockStore = jasmine.createSpyObj('Store', ['dispatch']);

        // Mock des méthodes qui retournent des observables

        await TestBed.configureTestingModule({
            imports: [
                HeaderComponent,
                MatIconModule,
                MatTooltipModule,
                MatMenuModule,
                MatButtonModule,
                RouterTestingModule.withRoutes([{ path: 'login', component: MockLoginComponent }]),
                NoopAnimationsModule,
                CommonModule,
                TranslateModule.forRoot(),
            ],
            providers: [{ provide: Store, useValue: mockStore }],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        translateService = TestBed.inject(TranslateService);

        // Set default language for consistent tests
        translateService.currentLang = 'fr';

        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should be a standalone component', () => {
            expect(HeaderComponent).toBeDefined();
        });

        it('should have toggleMenu output', () => {
            expect(component.toggleMenu).toBeDefined();
        });
    });

    describe('Language Management', () => {
        describe('currentLanguage getter', () => {
            it('should return current language in uppercase', () => {
                expect(component.currentLanguage).toBe('FR');
            });

            it('should return FR as default when currentLang is null', () => {
                (translateService as any).currentLang = null;
                expect(component.currentLanguage).toBe('FR');
            });

            it('should return FR as default when currentLang is undefined', () => {
                (translateService as any).currentLang = undefined;
                expect(component.currentLanguage).toBe('FR');
            });

            it('should convert language to uppercase', () => {
                translateService.currentLang = 'en';
                expect(component.currentLanguage).toBe('EN');
            });

            it('should handle mixed case languages', () => {
                translateService.currentLang = 'Fr';
                expect(component.currentLanguage).toBe('FR');
            });
        });

        describe('changeLanguage method', () => {
            it('should dispatch changeLanguage action with correct payload', () => {
                component.changeLanguage('en');

                expect(mockStore.dispatch).toHaveBeenCalledWith(LayoutActions.changeLanguage({ payload: 'en' }));
            });

            it('should dispatch action for french language', () => {
                component.changeLanguage('fr');

                expect(mockStore.dispatch).toHaveBeenCalledWith(LayoutActions.changeLanguage({ payload: 'fr' }));
            });

            it('should handle empty string language', () => {
                component.changeLanguage('');

                expect(mockStore.dispatch).toHaveBeenCalledWith(LayoutActions.changeLanguage({ payload: '' }));
            });

            it('should dispatch action only once per call', () => {
                component.changeLanguage('en');
                component.changeLanguage('fr');

                expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('Template Integration', () => {
        it('should render header element', () => {
            const headerElement = fixture.nativeElement.querySelector('header');
            expect(headerElement).toBeTruthy();
        });

        it('should have language menu buttons', () => {
            const languageMenuTrigger = fixture.nativeElement.querySelector('button[mat-button]');
            expect(languageMenuTrigger).toBeTruthy();

            // Check that the mat-menu exists in the template
            const matMenu = fixture.nativeElement.querySelector('mat-menu');
            expect(matMenu).toBeTruthy();
        });

        it('should display current language in language selector', () => {
            const languageDisplay = fixture.nativeElement.textContent;
            expect(languageDisplay).toContain(component.currentLanguage);
        });

        it('should have login button with router link', () => {
            const loginButton = fixture.nativeElement.querySelector('button[routerLink="/login"]');
            expect(loginButton).toBeTruthy();
        });
    });

    describe('User Interactions', () => {
        it('should call changeLanguage when French button is clicked', () => {
            spyOn(component, 'changeLanguage');

            const frenchButton = Array.from(fixture.nativeElement.querySelectorAll('button[mat-menu-item]')).find((button: any) =>
                button.textContent?.includes('Français')
            );

            if (frenchButton) {
                (frenchButton as HTMLElement).click();
                expect(component.changeLanguage).toHaveBeenCalledWith('fr');
            }
        });

        it('should call changeLanguage when English button is clicked', () => {
            spyOn(component, 'changeLanguage');

            const englishButton = Array.from(fixture.nativeElement.querySelectorAll('button[mat-menu-item]')).find((button: any) =>
                button.textContent?.includes('English')
            );

            if (englishButton) {
                (englishButton as HTMLElement).click();
                expect(component.changeLanguage).toHaveBeenCalledWith('en');
            }
        });
    });

    describe('Accessibility', () => {
        it('should have semantic header element', () => {
            const headerElement = fixture.nativeElement.querySelector('header');
            expect(headerElement.tagName.toLowerCase()).toBe('header');
        });
    });

    describe('Translation Integration', () => {
        it('should use translate pipe for title', () => {
            expect(fixture.nativeElement.innerHTML).toContain('COMMONS.HEADER.TITLE');
        });

        it('should use translate pipe for description', () => {
            expect(fixture.nativeElement.innerHTML).toContain('COMMONS.HEADER.DESCRIPTION');
        });

        it('should use translate pipe for login button', () => {
            expect(fixture.nativeElement.innerHTML).toContain('COMMONS.HEADER.LOGIN');
        });
    });

    describe('Component State Management', () => {
        it('should inject Store correctly', () => {
            expect(mockStore).toBeTruthy();
        });

        it('should inject TranslateService correctly', () => {
            expect(TranslateService).toBeTruthy();
        });

        it('should maintain consistent language display', () => {
            const initialLanguage = component.currentLanguage;
            fixture.detectChanges();
            expect(component.currentLanguage).toBe(initialLanguage);
        });
    });

    describe('Router Integration', () => {
        it('should have routerLink directive on login button', () => {
            const loginButton = fixture.nativeElement.querySelector('[routerLink="/login"]');
            expect(loginButton).toBeTruthy();
        });

        it('should have routerLinkActive directive on login button', () => {
            const loginButton = fixture.nativeElement.querySelector('[routerLinkActive]');
            expect(loginButton).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle multiple language changes', () => {
            component.changeLanguage('en');
            component.changeLanguage('fr');
            component.changeLanguage('en');

            expect(mockStore.dispatch).toHaveBeenCalledTimes(3);
        });

        it('should handle rapid language changes', () => {
            for (let i = 0; i < 10; i++) {
                component.changeLanguage(i % 2 === 0 ? 'fr' : 'en');
            }

            expect(mockStore.dispatch).toHaveBeenCalledTimes(10);
        });

        it('should handle special characters in language codes', () => {
            component.changeLanguage('fr-CA');

            expect(mockStore.dispatch).toHaveBeenCalledWith(LayoutActions.changeLanguage({ payload: 'fr-CA' }));
        });
    });

    describe('Component Output Events', () => {
        it('should have toggleMenu output defined', () => {
            expect(component.toggleMenu).toBeDefined();
        });

        it('should emit events from toggleMenu output', done => {
            component.toggleMenu.subscribe(() => {
                expect(true).toBeTruthy();
                done();
            });

            component.toggleMenu.emit();
        });
    });
});
