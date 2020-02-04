import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitHeadComponent } from './unit-head.component';

describe('UnitHeadComponent', () => {
  let component: UnitHeadComponent;
  let fixture: ComponentFixture<UnitHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
