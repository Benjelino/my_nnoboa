import { TestBed } from '@angular/core/testing';

import { NoboaService } from './noboa.service';


describe('NoboaService', () => {
  let service: NoboaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoboaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
