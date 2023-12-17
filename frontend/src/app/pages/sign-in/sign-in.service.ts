import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SignIn } from '../../model/signin';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  constructor(private httpClient: HttpClient) {}

  signIn(username: string, password: string): Observable<SignIn> {
    return this.httpClient.get<SignIn>(
      `${environment.url}/sign-in/${username}?password=${password}`
    );
  }
}
