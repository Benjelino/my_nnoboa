import { TestBed } from '@angular/core/testing';

import { TrustModelService } from './trust-model.service';

describe('TrustModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrustModelService = TestBed.get(TrustModelService);
    expect(service).toBeTruthy();
  });
});
