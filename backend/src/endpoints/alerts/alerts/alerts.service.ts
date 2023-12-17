import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AlertsDto } from './alerts.dto';

@Injectable()
export class AlertsService implements OnApplicationBootstrap {
  alerta_service_url: string;
  alerta_token: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  onApplicationBootstrap() {
    this.alerta_service_url =
      this.configService.get<string>('ALERTA_SERVICE_URL');
    this.alerta_token = this.configService.get<string>('ALERTA_SERVICE_TOKEN');
  }

  async getAlerts(): Promise<any> {
    const headersRequest = {
      Authorization: 'Key ' + this.alerta_token,
    };
    const response = await lastValueFrom(
      this.httpService.get(this.alerta_service_url + '/api/alerts', {
        headers: headersRequest,
      }),
    );

    return response.data;
  }
}
