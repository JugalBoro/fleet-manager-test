import { TestBed } from '@angular/core/testing';

import { GridColService } from './grid-col.service';

describe('GridColService', () => {
  let service: GridColService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridColService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
