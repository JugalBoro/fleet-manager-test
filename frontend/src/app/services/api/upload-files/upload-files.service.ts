import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { FieldId, MongoId } from '../../../model/ids';

@Injectable({
  providedIn: 'root',
})
export class UploadFilesService {
  private path = '/file';

  constructor(private http: HttpClient) {}

  fetchFileById(id: string): Observable<any> {
    return this.http.get(environment.url + this.path + '/' + id);
  }

  fetchMultipleFilesByIds(
    ids: {
      fileId: MongoId;
      fieldId: FieldId;
      assetId: MongoId | undefined;
    }[]
  ): Observable<any> {
    return this.http.post(environment.url + this.path + '/multiple', ids, {
      params: {
        ids: JSON.stringify(ids),
      },
    });
  }

  deleteFileById(id: MongoId): Observable<any> {
    return this.http.delete(environment.url + this.path + '/delete/' + id);
  }

  uploadFile(file: File, fieldId: MongoId, assetId: MongoId): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(environment.url + this.path + '/upload', formData, {
      reportProgress: true,
      observe: 'events',
      params: {
        fieldId,
        assetId,
      },
    });
  }
}
