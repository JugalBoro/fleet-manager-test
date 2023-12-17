import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignInService } from './sign-in.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'infus-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  @HostBinding('class') class = 'infus-sign-in';

  constructor(
    private signInService: SignInService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  loginForm;

  submitted = false;
  error = false;

  ngOnInit() {
    if (this.cookieService.check('access_token')) {
      this.router.navigate(['/assets']);
    }

    this.loginForm = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.submitted = true;
    this.signInService
      .signIn(this.loginForm.value.login, this.loginForm.value.password)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.error = true;
          }
          return throwError('Something bad happened; please try again later.');
        })
      )
      .subscribe((data) => {
        this.cookieService.set(
          'access_token',
          data.access_token,
          data.expires_in
        );
        this.router.navigate(['/assets']);
      });
  }
}
