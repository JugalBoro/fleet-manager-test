import { Component, Input, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { Notification } from '../../model/notifications';
import { CommonModule } from '@angular/common';
import { NotificationsStore } from '../../services/store/notifications/notifications.store';

@Component({
  selector: 'infus-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone: true,
  imports: [AvatarModule, BadgeModule, ButtonModule, CommonModule],
})
export class NotificationComponent implements OnInit {
  @Input() public notifications: Notification[] | null = null;

  constructor(private notificationsStore: NotificationsStore) {}

  ngOnInit(): void {
    this.notificationsStore.getNotifications();
  }

  getIcon(
    type: 'ok' | 'warning' | 'machine-warning' | 'machine-error'
  ): string {
    switch (type) {
      default:
      case 'ok':
        return 'pi pi-info-circle';
      case 'warning':
        return 'pi pi-info-circle';
      case 'machine-warning':
        return 'pi pi-exclamation-triangle';
      case 'machine-error':
        return 'pi pi-times';
    }
  }

  getTextColor(
    type: 'ok' | 'warning' | 'machine-warning' | 'machine-error'
  ): string {
    switch (type) {
      default:
      case 'ok':
        return 'var(--ok-color)';
      case 'warning':
        return 'var(--warning-color)';
      case 'machine-warning':
        return 'var(--warning-color)';
      case 'machine-error':
        return 'var(--error-color)';
    }
  }

  getBackgroundColor(
    type: 'ok' | 'warning' | 'machine-warning' | 'machine-error'
  ): string {
    switch (type) {
      default:
      case 'ok':
        return 'var(--primary-color-light)';
      case 'warning':
        return 'var(--warning-color-light)';
      case 'machine-warning':
        return 'var(--warning-color-light)';
      case 'machine-error':
        return 'var(--error-color-light)';
    }
  }
}
