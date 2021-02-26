import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Gates } from '../lib/gates';

import { GateViewComponent } from './gate-view.component';

describe('GateViewComponent', () => {
  let component: GateViewComponent;
  let fixture: ComponentFixture<GateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GateViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GateViewComponent);
    component = fixture.componentInstance;
    component.gate = Gates.gatesMap.get('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
