import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateSelectComponent } from './gate-select.component';

describe('GateSelectComponent', () => {
  let component: GateSelectComponent;
  let fixture: ComponentFixture<GateSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GateSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GateSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
