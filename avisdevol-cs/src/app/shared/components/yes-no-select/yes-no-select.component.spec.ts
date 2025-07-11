import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { BooleanDisplayPipe } from '@scalaadm-cs/shared';

import { YesNoSelectComponent } from './yes-no-select.component';

describe('YesNoSelectComponent', () => {
    let component: YesNoSelectComponent;
    let fixture: ComponentFixture<YesNoSelectComponent>;

    const formBuilder = new FormBuilder();
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [YesNoSelectComponent, BooleanDisplayPipe],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [TranslateModule.forRoot()],
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

    it('should exists', () => {
        const selectType = fixture.debugElement.query(By.css('*[data-type]'));
        expect(selectType).not.toBeNull();
        const options = selectType.nativeElement.querySelectorAll('mat-option');
        expect(options.length).toEqual(3);
    });
});
