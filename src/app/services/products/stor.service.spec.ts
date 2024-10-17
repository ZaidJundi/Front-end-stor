import { TestBed } from '@angular/core/testing';

import { StorService } from './stor.service';

describe('StorService', () => {
  let service: StorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
