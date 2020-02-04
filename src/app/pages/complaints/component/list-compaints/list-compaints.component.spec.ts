import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompaintsComponent } from './list-compaints.component';

describe('ListCompaintsComponent', () => {
  let component: ListCompaintsComponent;
  let fixture: ComponentFixture<ListCompaintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCompaintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
