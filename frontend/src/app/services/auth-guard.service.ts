import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(): boolean {
    if (!this.cookieService.check('access_token')) {
      this.router.navigate(['signin']);
      return false;
    }
    return true;
  }
}
