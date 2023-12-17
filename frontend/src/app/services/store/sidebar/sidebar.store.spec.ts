import { TestBed } from '@angular/core/testing';

import { SidebarStore } from './sidebar.store';

describe('SidebarService', () => {
  let store: SidebarStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(SidebarStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });
});
