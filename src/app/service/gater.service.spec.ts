import { TestBed, inject } from '@angular/core/testing';

import { GaterService } from './gater.service';

describe('GaterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GaterService]
    });
  });

  it('should be created', inject([GaterService], (service: GaterService) => {
    expect(service).toBeTruthy();
  }));
});
