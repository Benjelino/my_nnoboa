import { TestBed } from '@angular/core/testing';

import { RemoteService } from './remote.service';

describe('RemoteServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemoteService = TestBed.get(RemoteService);
    expect(service).toBeTruthy();
  });
});
