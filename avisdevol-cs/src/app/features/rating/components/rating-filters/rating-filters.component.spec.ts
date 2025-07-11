import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingFiltersComponent } from './rating-filters.component';

describe('RatingFiltersComponent', () => {
    let component: RatingFiltersComponent;
    let fixture: ComponentFixture<RatingFiltersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RatingFiltersComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RatingFiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
