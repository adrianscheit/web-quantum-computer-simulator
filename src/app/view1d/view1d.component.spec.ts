import { ComponentFixture, TestBed } from '@angular/core/testing';

import { View1dComponent } from './view1d.component';

describe('View1dComponent', () => {
    let component: View1dComponent;
    let fixture: ComponentFixture<View1dComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [View1dComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(View1dComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
