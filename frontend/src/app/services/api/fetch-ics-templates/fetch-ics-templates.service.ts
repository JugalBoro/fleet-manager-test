import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IcsTemplateDescription,
  IcsTemplateDto,
} from '../../../model/ics-template';
import { environment } from '../../../../environments/environment';
import { options } from '../../../httpHeaderAuthorization';

@Injectable({
  providedIn: 'root',
})
export class FetchIcsTemplatesService {
  private path = '/ics/templates/';

  constructor(private http: HttpClient) {}

  fetchIcsTemplateDescriptions(): Observable<IcsTemplateDescription[]> {
    return this.http.get<IcsTemplateDescription[]>(
      environment.url + this.path,
      options
    );
  }

  fetchIcsTemplates(id: string): Observable<IcsTemplateDto> {
    return this.http.get<IcsTemplateDto>(
      environment.url + this.path + id,
      options
    );
  }
}
