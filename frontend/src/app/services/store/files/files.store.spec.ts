import { TestBed } from '@angular/core/testing';

import { FilesStore } from './files.store';

describe('FilesStore', () => {
  let service: FilesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
