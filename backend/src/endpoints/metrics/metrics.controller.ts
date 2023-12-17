import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { AuthGuard } from 'nest-keycloak-connect';
import { Headers } from '@nestjs/common';
import { AssetService } from '../asset/asset.service';
import { IcsService } from '../ics-templates/ics.service';

@Controller('metrics')
@UseGuards(AuthGuard)
export class MetricsController {
  constructor(
    private metricsService: MetricsService,
    private assetService: AssetService,
    private icsService: IcsService,
  ) {}

  //'default\\urn:ngsi-ld:assetv5:2:45\\http://www.industry-fusion.org/fields#base-objects-v0.1-power-supply-runtime-electric-power',

  private metrics = {
    'sensor-v0.1-sensor-runtime-ambient-noise': {
      name: 'Noise',
    },
    'sensor-v0.1-sensor-runtime-ambient-operating-temperature': {
      name: 'Temperature',
    },
    'sensor-v0.1-sensor-runtime-dustiness': {
      name: 'Dustiness',
    },
    'sensor-v0.1-sensor-runtime-relative-humidity': {
      name: 'Humidity',
    },
    'base-objects-v0.1-power-supply-runtime-electric-power': {
      name: 'Electric Power',
    },
    'base-objects-v0.1-power-supply-runtime-electric-power-l1': {
      name: 'Electric Power L1',
    },
    'base-objects-v0.1-power-supply-runtime-electric-power-l2': {
      name: 'Electric Power L2',
    },
    'base-objects-v0.1-power-supply-runtime-electric-power-l3': {
      name: 'Electric Power L3',
    },
    'base-objects-v0.1-power-supply-runtime-current-strength-l1': {
      name: 'Current Strength L1',
    },
    'base-objects-v0.1-power-supply-runtime-current-strength-l2': {
      name: 'Current Strength L2',
    },
    'base-objects-v0.1-power-supply-runtime-current-strength-l3': {
      name: 'Current Strength L3',
    },
    'base-objects-v0.1-power-supply-runtime-supply-voltage-l1': {
      name: 'Supply Voltage L1',
    },
    'base-objects-v0.1-power-supply-runtime-supply-voltage-l2': {
      name: 'Supply Voltage L2',
    },
    'base-objects-v0.1-power-supply-runtime-supply-voltage-l3': {
      name: 'Supply Voltage L3',
    },
    'laser-cutter-v0.1-laser-cutter-runtime-cutter-head-speed': {
      name: 'Head Speed',
    },
    'laser-cutter-v0.1-laser-cutter-runtime-machine-position-x': {
      name: 'Head Position X',
    },
    'laser-cutter-v0.1-laser-cutter-runtime-machine-position-y': {
      name: 'Head Position Y',
    },
    'laser-cutter-v0.1-laser-cutter-runtime-machine-position-z': {
      name: 'Head Position Z',
    },
    'plasma-cutter-v0.1-plasma-cutter-runtime-cutter-head-speed': {
      name: 'Head Speed',
    },
    'plasma-cutter-v0.1-plasma-cutter-runtime-machine-position-x': {
      name: 'Head Position X',
    },
    'plasma-cutter-v0.1-plasma-cutter-runtime-machine-position-y': {
      name: 'Head Position Y',
    },
    'plasma-cutter-v0.1-plasma-cutter-runtime-machine-position-z': {
      name: 'Head Position Z',
    },
    'filter-v0.1-filter-runtime-operating-hours': {
      name: 'Operating Hours',
    },
    'filter-v0.1-filter-runtime-next-maintenance': {
      name: 'Next Maintenance',
    },
    'filter-v0.1-filter-runtime-rotation-speed': {
      name: 'Rotation Speed',
    },
    'filter-v0.1-filter-runtime-nominal-airflow': {
      name: 'Nominal Airflow',
    },
  };

  private stateMetrics = {
    'urn:ngsi-ld:assetv5:2:44':
      'default\\urn:ngsi-ld:assetv5:2:44\\http://www.industry-fusion.org/fields#sensor-v0.1-sensor-runtime-machine-state',
    'urn:ngsi-ld:assetv5:2:45':
      'default\\urn:ngsi-ld:assetv5:2:45\\http://www.industry-fusion.org/fields#power-source-v0.1-power-source-runtime-machine-state',
    'urn:ngsi-ld:assetv5:2:46':
      'default\\urn:ngsi-ld:assetv5:2:46\\http://www.industry-fusion.org/fields#base-objects-v0.1-operation-conditions-runtime-machine-state',
    'urn:ngsi-ld:assetv5:2:47':
      'default\\urn:ngsi-ld:assetv5:2:47\\http://www.industry-fusion.org/fields#laser-cutter-v0.1-laser-cutter-runtime-machine-state',
    'urn:ngsi-ld:assetv5:2:49':
      'default\\urn:ngsi-ld:assetv5:2:49\\http://www.industry-fusion.org/fields#laser-cutter-v0.1-laser-cutter-runtime-machine-state',
    'urn:ngsi-ld:assetv5:2:50':
      'default\\urn:ngsi-ld:assetv5:2:50\\http://www.industry-fusion.org/fields#filter-v0.1-filter-runtime-machine-state',
    'urn:ngsi-ld:assetv5:2:55':
      'default\\urn:ngsi-ld:assetv5:2:55\\http://www.industry-fusion.org/fields#plasma-cutter-v0.1-plasma-cutter-runtime-machine-state',
    'urn:ngsi-ld:assetv5:2:56':
      'default\\urn:ngsi-ld:assetv5:2:56\\http://www.industry-fusion.org/fields#sensor-v0.1-sensor-runtime-machine-state',
    'urn:ngsi-ld:assetv5:2:48':
      'default\\urn:ngsi-ld:assetv5:2:48\\http://www.industry-fusion.org/fields#plasma-cutter-v0.1-plasma-cutter-runtime-machine-state',
  };

  @Get('assets/groupedStats')
  async getGroupedMachineStates(
    @Headers() headers,
    @Query('assets') assetsIds: string,
  ): Promise<any> {
    const assets = await this.assetService.findByIds(assetsIds.split(','));

    let metrics = assets.map((asset) => {
      return this.stateMetrics[
        asset.metadata['base-objects-v0.1-ifric-identification-urn-id'].value
      ];
    });

    metrics = metrics.filter((asset) => {
      return asset !== undefined;
    });

    const data = await this.metricsService.getGroupedMachineStates(
      headers,
      metrics,
    );

    return data;
  }

  @Get('power')
  async getPower(@Headers() headers, @Query('assets') assetIds): Promise<any> {
    const data = await this.metricsService.getMachinePower(
      headers,
      assetIds.split(','),
    );
    return data;
  }

  @Get('assets/:assetId/:startdate/:enddate')
  async getAssetMetrics(
    @Headers() headers,
    @Param('assetId') assetId: string,
    @Param('startdate') startdate: number,
    @Param('enddate') enddate: number,
  ): Promise<any> {
    const asset = await this.assetService.findById(assetId);

    // const startdate = Date.now() - 1000 * 60 * 60 * 24;
    // const enddate = Date.now(); // 1 hour

    const retState = await this.metricsService.getMachineState(
      headers,
      asset,
      startdate,
      enddate,
    );

    const ret = await this.metricsService.getRuntimeMetrics(
      headers,
      asset,
      this.metrics,
      startdate,
      enddate,
    );

    const retName = Object.getOwnPropertyNames(ret);

    for (const metricName of retName) {
      if (this.metrics[metricName].min !== undefined) {
        ret[metricName].min = parseInt(
          asset['metadata'][this.metrics[metricName].min].value,
        );
      }

      if (this.metrics[metricName].max !== undefined) {
        ret[metricName].max = parseInt(
          asset['metadata'][this.metrics[metricName].max].value,
        );
      }

      if (ret[metricName] != undefined) {
        ret[metricName]['state'] = retState.queries[0].results[0].values;
        ret[metricName]['name'] = this.metrics[metricName].name;
      }
    }

    return ret;
  }
}
