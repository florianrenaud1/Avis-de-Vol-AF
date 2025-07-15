import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { YesNoSelectComponent } from './yes-no-select.component';
import { BooleanDisplayPipe } from '../../pipes';

describe('YesNoSelectComponent', () => {
    let component: YesNoSelectComponent;
    let fixture: ComponentFixture<YesNoSelectComponent>;

    const formBuilder = new FormBuilder();
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                YesNoSelectComponent,
                BooleanDisplayPipe,
                TranslateModule.forRoot()
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(YesNoSelectComponent);
        component = fixture.componentInstance;
        // Init form
        fixture.componentRef.setInput('control', formBuilder.control(undefined));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should exist and have proper structure', async () => {
        const selectType = fixture.debugElement.query(By.css('*[data-type]'));
        expect(selectType).not.toBeNull();
        
        // Attend que le template soit stable
        await fixture.whenStable();
        fixture.detectChanges();
        
        // Pour un mat-select, les options ne sont visibles qu'après ouverture
        // Vérifions plutôt la présence du mat-select
        const matSelect = fixture.debugElement.query(By.css('mat-select'));
        expect(matSelect).toBeTruthy();
        
        // Si on veut tester les options, il faut ouvrir le select
        if (matSelect) {
            // Simulate click to open the select
            matSelect.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
            
            // Les options sont maintenant dans un overlay, pas dans le composant principal
            const options = document.querySelectorAll('mat-option');
            expect(options.length).toEqual(3);
        }
    });
});
