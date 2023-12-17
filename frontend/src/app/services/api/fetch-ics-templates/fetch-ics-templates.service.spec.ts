import { TestBed } from '@angular/core/testing';

import { FetchIcsTemplatesService } from './fetch-ics-templates.service';

describe('FetchIcsTemplatesService', () => {
  let service: FetchIcsTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchIcsTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
