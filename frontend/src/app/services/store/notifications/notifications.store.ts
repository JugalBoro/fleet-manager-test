import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FetchNotificationsService } from '../../api/fetch-notifications/fetch-notifications.service';
import { Notification } from '../../../model/notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationsStore {
  public notifications$: Subject<Notification[]> = new Subject<
    Notification[]
  >();

  constructor(private fetchNotificationsService: FetchNotificationsService) {}

  public getNotifications(): void {
    this.fetchNotificationsService
      .fetchNotifications()
      .subscribe((notifications: any[]) => {
        this.notifications$.next(notifications);
      });
  }
}
