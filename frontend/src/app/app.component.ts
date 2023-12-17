import { Component, OnInit } from '@angular/core';
import { MessageStore } from './services/store/message/message.store';
import { AssetsStore } from './services/store/assets/assets.store';
import { SidebarStore } from './services/store/sidebar/sidebar.store';
import { NotificationsStore } from './services/store/notifications/notifications.store';
import { Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'infus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public assetsAmount$: Subject<number> = new Subject();
  sidebarVisible = false;
  public nrNotifications = 0;
  public notifications$;

  constructor(
    private messageStore: MessageStore,
    private assetsStore: AssetsStore,
    public sidebarStore: SidebarStore,
    public notificationsStore: NotificationsStore,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationsStore.notifications$;

    this.notifications$.subscribe((notifications) => {
      this.nrNotifications = notifications.length;
    });

    this.assetsAmount$ = this.assetsStore.assetsAmount$;
    this.messageStore.getMessage();
    this.sidebarStore.getStore$.subscribe((store) => {
      this.sidebarVisible = store.filter(
        (item) => item.id === 'MANAGE_NOTIFICATIONS'
      )[0]?.isOpen;
    });
    this.cdRef.detectChanges();
  }
}
