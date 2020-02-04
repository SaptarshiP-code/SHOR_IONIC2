import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferComplaintComponent } from './transfer-complaint.component';

describe('TransferComplaintComponent', () => {
  let component: TransferComplaintComponent;
  let fixture: ComponentFixture<TransferComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
