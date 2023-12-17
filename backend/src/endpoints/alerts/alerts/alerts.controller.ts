import { Controller, Get } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { NotificationDto } from './alerts.dto';
import { AssetService } from 'src/endpoints/asset/asset.service';

@Controller('alerts')
export class AlertsController {
  constructor(
    private alertsService: AlertsService,
    private assetService: AssetService,
  ) {}

  @Get('alerts')
  async getAssetsAlerts(): Promise<NotificationDto[]> {
    const ret = await this.alertsService.getAlerts();

    //TODO: get machine from asset service only by resource ID
    const assets = await this.assetService.findAll();

    const notifications = ret.alerts.map((alert) => {
      const machine = assets.find(
        (asset) =>
          asset.metadata['base-objects-v0.1-ifric-identification-urn-id']
            .value == alert.resource,
      );

      if (machine === undefined) {
        return null;
      }

      const notification = new NotificationDto();
      notification.id = alert.id;
      notification.text = alert.text.replace(
        'http://www.industry-fusion.org/fields#',
        '',
      );
      notification.machine = {
        alias:
          machine.metadata['base-objects-v0.1-machine-identification-alias']
            .value,
        assetName:
          machine.metadata[
            'base-objects-v0.1-ifric-identification-asset-manufacturer-name'
          ].value,
        //   id: machine._id
      };
      notification.group = alert.group;
      notification.type = alert.severity;
      notification.status = alert.status;
      notification.timestamp = alert.createTime;
      return notification;
    });

    return notifications.filter((notification) => notification !== null);
  }
}
