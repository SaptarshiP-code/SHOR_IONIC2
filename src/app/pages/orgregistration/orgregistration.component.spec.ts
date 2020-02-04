import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgregistrationComponent } from './orgregistration.component';

describe('OrgregistrationComponent', () => {
  let component: OrgregistrationComponent;
  let fixture: ComponentFixture<OrgregistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgregistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
