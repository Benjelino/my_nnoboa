import { TestBed } from '@angular/core/testing';

import { CryptojsService } from './cryptojs.service';

describe('CryptojsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CryptojsService = TestBed.get(CryptojsService);
    expect(service).toBeTruthy();
  });
});
