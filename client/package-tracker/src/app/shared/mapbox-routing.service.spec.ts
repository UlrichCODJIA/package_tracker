import { TestBed } from '@angular/core/testing';

import { MapboxRoutingService } from './mapbox-routing.service';

describe('MapboxRoutingService', () => {
  let service: MapboxRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapboxRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
