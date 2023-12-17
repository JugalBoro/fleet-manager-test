import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'infus-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css'],
})
export class MainmenuComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }
  @Input()
  public assetsAmount: number | null = null;
  public screenWidth = 0;

  constructor(
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit(): void {
    this.onResize();
  }

  isActive(url: UrlTree | string): boolean {
    return this.router.isActive(url, true);
  }

  isMobile(): boolean {
    return this.screenWidth < 900;
  }
}
