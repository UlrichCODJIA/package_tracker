import { TestBed } from '@angular/core/testing';

import { RealTimeUpdatesService } from './real-time-updates.service';

describe('RealTimeUpdatesService', () => {
  let service: RealTimeUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealTimeUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
