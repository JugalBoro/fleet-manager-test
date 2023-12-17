import { HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';

export const options = {
  headers: new HttpHeaders({
    Authorization:
      'Basic ' +
      btoa(environment.httpBasicUser + ':' + environment.httpBasicPassword),
  }),
};
