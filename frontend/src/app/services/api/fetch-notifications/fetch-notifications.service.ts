import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Notification } from '../../../model/notifications';

@Injectable({
  providedIn: 'root',
})
export class FetchNotificationsService {
  private path = '/notifications';

  constructor(private http: HttpClient) {}

  fetchNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(environment.url + '/alerts/alerts');
    // TODO: Fix temporary
    // return of([
    //   {
    //     id: '1',
    //     title: 'System Info',
    //     text: 'This is some info',
    //     type: 'system-info',
    //     status: 'unread',
    //     timestamp: '2021-05-05T12:00:00.000Z',
    //     group: 'Gruppe 1',
    //   },
    //   {
    //     id: '2',
    //     title: 'Info',
    //     text: 'This is some info about the Laser Cutter',
    //     machine: {
    //       alias: 'My laser cutter 123',
    //       assetName: 'Q-1500',
    //       id: '123',
    //     },
    //     type: 'machine-info',
    //     status: 'unread',
    //     timestamp: '2021-05-05T12:00:00.000Z',
    //     group: 'Gruppe 1',
    //   },
    //   {
    //     id: '3',
    //     title: 'Error',
    //     text: 'This is some error',
    //     type: 'machine-error',
    //     machine: {
    //       alias: 'My laser cutter 123',
    //       assetName: 'Q-1500',
    //       id: '123',
    //     },
    //     status: 'unread',
    //     timestamp: '2021-05-05T12:00:00.000Z',
    //     group: 'Gruppe 1',
    //   },
    //   {
    //     id: '4',
    //     title: 'Warning',
    //     text: 'This is some warning',
    //     type: 'machine-warning',
    //     machine: {
    //       alias: 'My laser cutter 123',
    //       assetName: 'Q-1500',
    //       id: '123',
    //     },
    //     status: 'unread',
    //     timestamp: '2021-05-05T12:00:00.000Z',
    //     group: 'Gruppe 1',
    //   },
    //   {
    //     id: '5',
    //     title: 'Info',
    //     text: 'This is some info that has been read',
    //     type: 'machine-info',
    //     machine: {
    //       alias: 'My laser cutter 123',
    //       assetName: 'Q-1500',
    //       id: '123',
    //     },
    //     status: 'read',
    //     timestamp: '2021-05-05T12:00:00.000Z',
    //     group: 'Gruppe 1',
    //   },
    // ]);
  }
}
