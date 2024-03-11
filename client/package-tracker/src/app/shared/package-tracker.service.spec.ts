import { TestBed } from '@angular/core/testing';

import { PackageTrackerService } from './package-tracker.service';

describe('PackageTrackerService', () => {
  let service: PackageTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
