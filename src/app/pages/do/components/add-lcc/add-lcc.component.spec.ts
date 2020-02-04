import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLccComponent } from './add-lcc.component';

describe('AddLccComponent', () => {
  let component: AddLccComponent;
  let fixture: ComponentFixture<AddLccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
