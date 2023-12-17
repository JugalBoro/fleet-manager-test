import { TestBed } from '@angular/core/testing';

import { FetchNotificationsService } from './fetch-notifications.service';

describe('FetchNotificationsService', () => {
  let service: FetchNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
