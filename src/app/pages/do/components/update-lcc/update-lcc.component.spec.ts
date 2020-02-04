import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLccComponent } from './update-lcc.component';

describe('UpdateLccComponent', () => {
  let component: UpdateLccComponent;
  let fixture: ComponentFixture<UpdateLccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateLccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
