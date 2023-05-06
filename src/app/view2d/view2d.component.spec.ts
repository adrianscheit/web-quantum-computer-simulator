import { ComponentFixture, TestBed } from '@angular/core/testing';

import { View2dComponent } from './view2d.component';

describe('View2dComponent', () => {
    let component: View2dComponent;
    let fixture: ComponentFixture<View2dComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [View2dComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(View2dComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
