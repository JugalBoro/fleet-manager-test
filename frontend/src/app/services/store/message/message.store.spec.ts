import { TestBed } from '@angular/core/testing';

import { MessageStore } from './message.store';

describe('MessageService', () => {
  let store: MessageStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(MessageStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });
});
