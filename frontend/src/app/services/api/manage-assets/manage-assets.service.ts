import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Asset } from '../../../model/asset';
import { options } from '../../../httpHeaderAuthorization';
import { FieldId, MongoId } from '../../../model/ids';

@Injectable({
  providedIn: 'root',
})
export class ManageAssetsService {
  private path = '/assets';

  constructor(private http: HttpClient) {}

  fetchAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(environment.url + this.path);
  }

  deleteAsset(id: string): Observable<Asset> {
    return this.http.delete<Asset>(
      environment.url + this.path + '/delete/' + id,
      options
    );
  }

  removeFileFromAsset(
    assetId: MongoId,
    fileId: MongoId,
    fieldId: FieldId
  ): Observable<any> {
    return this.http.put(
      environment.url + this.path + '/remove/file/' + fileId,
      {
        assetId,
        fieldId,
      }
    );
  }

  createAsset(asset: Asset): Observable<Asset> {
    return this.http.post<Asset>(
      environment.url + this.path + '/create',
      asset,
      options
    );
  }

  fetchAssetById(id: string): Observable<Asset> {
    return this.http.get<Asset>(
      environment.url + this.path + '/' + id,
      options
    );
  }

  updateAssetById(id: string, asset: Asset): Observable<Asset> {
    return this.http.put<Asset>(
      environment.url + this.path + '/update/' + id,
      asset,
      options
    );
  }
}
