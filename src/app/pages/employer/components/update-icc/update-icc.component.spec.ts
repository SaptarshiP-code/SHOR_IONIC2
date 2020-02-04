import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIccComponent } from './update-icc.component';

describe('UpdateIccComponent', () => {
  let component: UpdateIccComponent;
  let fixture: ComponentFixture<UpdateIccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateIccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateIccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
