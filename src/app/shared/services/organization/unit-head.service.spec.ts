import { TestBed } from '@angular/core/testing';

import { UnitHeadService } from './unit-head.service';

describe('UnitHeadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnitHeadService = TestBed.get(UnitHeadService);
    expect(service).toBeTruthy();
  });
});
