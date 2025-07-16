import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

const createMockActivatedRoute = (id = '1') => ({
    snapshot: {
        params: { id },
    },
});

describe('AppComponent', () => {
    const mockStore: jasmine.SpyObj<Store> = jasmine.createSpyObj('Store', ['dispatch']);
    let translateService: TranslateService;
    let mockActivatedRoute: any;

    beforeEach(async () => {
        mockActivatedRoute = createMockActivatedRoute('1');

        await TestBed.configureTestingModule({
            imports: [AppComponent, TranslateModule.forRoot()],
            providers: [
                { provide: Store, useValue: mockStore },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
        }).compileComponents();

        translateService = TestBed.inject(TranslateService);
        // Set default language for consistent tests
        translateService.currentLang = 'fr';
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have the 'avisdevol-cs' title`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('avisdevol-cs');
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h1')?.textContent).toContain('COMMONS.HEADER.TITLE');
    });
});
