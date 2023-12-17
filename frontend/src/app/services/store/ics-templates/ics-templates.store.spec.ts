import { TestBed } from '@angular/core/testing';

import { AssetsStore } from '../assets/assets.store';

describe('AssetsStore', () => {
  let store: AssetsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(AssetsStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });
});
