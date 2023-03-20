import { TestBed } from '@angular/core/testing';

import { EcfundenumdataService } from './ecfundenumdata.service';

describe('EcfundenumdataService', () => {
  let service: EcfundenumdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcfundenumdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
