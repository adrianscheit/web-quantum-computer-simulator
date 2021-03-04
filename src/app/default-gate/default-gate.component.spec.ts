import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultGateComponent } from './default-gate.component';

describe('DefaultGateComponent', () => {
  let component: DefaultGateComponent;
  let fixture: ComponentFixture<DefaultGateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultGateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
