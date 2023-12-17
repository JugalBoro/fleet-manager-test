import { TestBed } from '@angular/core/testing';

import { NavigateBackService } from './navigate-back.service';

describe('NavigateBackService', () => {
  let service: NavigateBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigateBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
