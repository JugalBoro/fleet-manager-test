import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupedStateMetrics } from '../../../model/groupedStateMetrics';
import { Observable } from 'rxjs';
import { PowerMetrics } from '../../../model/powerMetrics';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetricsService {
  constructor(private http: HttpClient) {}

  public fetchGroupStateMetrics(
    assetIds: any[]
  ): Observable<GroupedStateMetrics> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('assets', assetIds.join(','));

    return this.http.get<GroupedStateMetrics>(
      environment.url + '/metrics/assets/groupedStats',
      { params: queryParams }
    );
  }

  public fetchPowerMetrics(assetIds: any[]): Observable<PowerMetrics> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('assets', assetIds.join(','));

    return this.http.get<PowerMetrics>(environment.url + '/metrics/power', {
      params: queryParams,
    });
  }

  public fetchMetrics(
    assetId: any,
    startdate: number,
    enddate: number
  ): Observable<PowerMetrics> {
    return this.http.get<PowerMetrics>(
      environment.url +
        '/metrics/assets/' +
        assetId +
        '/' +
        startdate +
        '/' +
        enddate
    );
  }
}
