import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmdeskComponent } from './dmdesk.component';

describe('DmdeskComponent', () => {
  let component: DmdeskComponent;
  let fixture: ComponentFixture<DmdeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmdeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmdeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
