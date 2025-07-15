import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';

import { DateRangeSummaryComponent } from './date-range-summary.component';
import { DateFormatPipe } from '@avisdevol-cs/shared';

describe('DateRangeSummaryComponent', () => {
    let component: DateRangeSummaryComponent;
    let fixture: ComponentFixture<DateRangeSummaryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DateRangeSummaryComponent,
                DateFormatPipe,
                TranslateModule.forRoot()
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DateRangeSummaryComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not exist', () => {
        const startDate = fixture.debugElement.query(By.css('*[data-startDate]'));
        expect(startDate).toBeNull();
        const endDate = fixture.debugElement.query(By.css('*[data-enddate]'));
        expect(endDate).toBeNull();
    });

    it('should exist', () => {
        fixture.componentRef.setInput('startDate', new FormControl(moment()));
        fixture.componentRef.setInput('endDate', new FormControl(moment()));
        fixture.detectChanges();
        const startDate = fixture.debugElement.query(By.css('*[data-startDate]'));
        expect(startDate).not.toBeNull();
        const endDate = fixture.debugElement.query(By.css('*[data-enddate]'));
        expect(endDate).not.toBeNull();
    });
});
