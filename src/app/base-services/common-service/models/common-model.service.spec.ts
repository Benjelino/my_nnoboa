import { TestBed } from '@angular/core/testing';

import { CommonModelService } from './common-model.service';

describe('CommonModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonModelService = TestBed.get(CommonModelService);
    expect(service).toBeTruthy();
  });
});
