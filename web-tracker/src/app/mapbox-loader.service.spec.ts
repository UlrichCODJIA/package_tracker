import { TestBed } from '@angular/core/testing';

import { MapboxLoaderService } from './mapbox-loader.service';

describe('MapboxLoaderService', () => {
  let service: MapboxLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapboxLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
