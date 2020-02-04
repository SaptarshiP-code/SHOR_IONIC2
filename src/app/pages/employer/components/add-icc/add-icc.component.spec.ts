import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIccComponent } from './add-icc.component';

describe('AddIccComponent', () => {
  let component: AddIccComponent;
  let fixture: ComponentFixture<AddIccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
