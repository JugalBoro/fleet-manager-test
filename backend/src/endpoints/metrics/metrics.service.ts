import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { KairosDBQueryDto } from './kairosQuery.dto';
import { AssetService } from '../asset/asset.service';

@Injectable()
export class MetricsService {
  constructor(
    private httpService: HttpService,
    private assetService: AssetService,
  ) {}

  assets: any = [];

  states = {
    '0': 'Offline',
    '1': 'Online_Idle',
    '2': 'Run',
    '3': 'Online_Error',
    '4': 'Online_Maintenance',
    '5': 'Setup',
    '6': 'Testing',
  };

  async getGroupedMachineStates(headers, metrics): Promise<any> {
    const now = Date.now();
    let today = new Date(now);
    const todayNr = today.setHours(0, 0, 0, 0);
    today = new Date(todayNr);
    const yesterday = today.setDate(today.getDate() - 1);
    const twoDaysAgo = today.setDate(today.getDate() - 1);
    const threeDaysAgo = today.setDate(today.getDate() - 1);
    const fourDaysAgo = today.setDate(today.getDate() - 1);

    const fourDaysAgoRes = await this.getMachineStates(
      headers,
      metrics,
      fourDaysAgo,
      threeDaysAgo,
    );
    const threeDaysAgoRes = await this.getMachineStates(
      headers,
      metrics,
      threeDaysAgo,
      twoDaysAgo,
    );
    const twoDaysAgoRes = await this.getMachineStates(
      headers,
      metrics,
      twoDaysAgo,
      yesterday,
    );
    const yesterdayRes = await this.getMachineStates(
      headers,
      metrics,
      yesterday,
      todayNr,
    );
    const todayRes = await this.getMachineStates(
      headers,
      metrics,
      todayNr,
      now,
    );

    const series = {
      Offline: [0, 0, 0, 0, 0],
      Online_Idle: [0, 0, 0, 0, 0],
      Run: [0, 0, 0, 0, 0],
      Online_Error: [0, 0, 0, 0, 0],
      Online_Maintenance: [0, 0, 0, 0, 0],
      Setup: [0, 0, 0, 0, 0],
      Testing: [0, 0, 0, 0, 0],
    };

    this.groupByMachineState(fourDaysAgoRes, series, 0);
    this.groupByMachineState(threeDaysAgoRes, series, 1);
    this.groupByMachineState(twoDaysAgoRes, series, 2);
    this.groupByMachineState(yesterdayRes, series, 3);
    this.groupByMachineState(todayRes, series, 4);

    let hundredPercent = metrics.length * 24;

    series.Online_Idle = series.Online_Idle.map((value) => {
      return Math.ceil((value / hundredPercent) * 100);
    });
    series.Run = series.Run.map((value) => {
      return Math.ceil((value / hundredPercent) * 100);
    });
    series.Online_Error = series.Online_Error.map((value) => {
      return Math.ceil((value / hundredPercent) * 100);
    });
    series.Online_Maintenance = series.Online_Maintenance.map((value) => {
      return Math.ceil((value / hundredPercent) * 100);
    });
    series.Setup = series.Setup.map((value) => {
      return Math.ceil((value / hundredPercent) * 100);
    });
    series.Testing = series.Testing.map((value) => {
      return Math.ceil((value / hundredPercent) * 100);
    });

    const hundred = [
      100,
      100,
      100,
      100,
      series.Online_Idle[4] +
        series.Run[4] +
        series.Online_Error[4] +
        series.Online_Maintenance[4] +
        series.Setup[4] +
        series.Testing[4],
    ];

    for (let i = 0; i < series.Offline.length; i++) {
      series.Offline[i] =
        hundred[i] -
        series.Online_Idle[i] -
        series.Run[i] -
        series.Online_Error[i] -
        series.Online_Maintenance[i] -
        series.Setup[i] -
        series.Testing[i];
    }

    let ret = Object.getOwnPropertyNames(series).map((key) => {
      return {
        name: key,
        data: series[key],
      };
    });

    const sumret = {
      series: ret,
      timestamps: [fourDaysAgo, threeDaysAgo, twoDaysAgo, yesterday, todayNr],
    };

    return sumret;
  }

  async getMachineStates(headers, metrics, startdate, enddate): Promise<any> {
    const ms = [];
    metrics.map((m) => {
      ms.push({
        name: m,
        aggregators: [
          {
            name: 'last',
            sampling: {
              value: 10,
              unit: 'minutes',
            },
          },
        ],
      });
    });

    const query = {
      start_absolute: startdate,
      end_absolute: enddate,
      metrics: ms,
    };

    // console.log(query);

    const headersRequest = {
      Authorization: headers.authorization, // afaik this one is not needed
    };

    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://development.industry-fusion.com/tsdb/api/v1/datapoints/query',
        query,
        { headers: headersRequest },
      ),
    );

    return data as KairosDBQueryDto;
  }

  async getAssetStatus(assetIds: string[], headers): Promise<any> {
    const headersRequest = {
      Authorization: headers.authorization, // afaik this one is not needed
    };

    const metrics = assetIds.map((assetId) => {
      return {
        name: `default\\${assetId}\\http://www.industry-fusion.org/fields#status`,
      };
    });

    const today = new Date();
    const enddate = today.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);
    const startdate = today.setDate(today.getDate() - 5);

    const query = {
      start_absolute: startdate,
      end_absolute: enddate,
      metrics: metrics,
    };

    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://development.industry-fusion.com/tsdb/api/v1/datapoints/query',
        query,
        { headers: headersRequest },
      ),
    );
    const res = data as KairosDBQueryDto;

    const assets = {};

    for (let i = 0; i < res.queries.length; i++) {
      const assetId = res.queries[i].results[0].name.split('\\')[1];
      assets[assetId] = {
        Offline: 0,
        Online_Idle: 0,
        Run: 0,
        Online_Error: 0,
        Online_Maintenance: 0,
        Setup: 0,
        Testing: 0,
      };
    }

    for (let i = 0; i < res.queries.length; i++) {
      const assetId = res.queries[i].results[0].name.split('\\')[1];
      const values = res.queries[i].results[0].values;

      if (values.length == 0) continue;

      let oldTimestamp = values[0][0];
      for (let j = 1; j < values.length; j++) {
        const timestamp = values[j][0];

        const state = values[j][1];

        assets[assetId][this.states[state]] +=
          (timestamp - oldTimestamp) / 1000 / 3600;
        oldTimestamp = timestamp;
      }
    }

    const ret = [];

    for (let i = 0; i < Object.getOwnPropertyNames(assets).length; i++) {
      const assetId = Object.getOwnPropertyNames(assets)[i];
      const asset = {
        assetId: assetId,
        alias: 'this machine ' + i,
        serialnumber: '13212313' + i,
        ...assets[assetId],
      };

      ret.push(asset);
    }

    return ret;
  }

  groupByMachineState(res, series, day) {
    //get timestamps of last 5 days
    for (let i = 0; i < res.queries.length; i++) {
      for (let j = 0; j < res.queries[i].results.length; j++) {
        const result = res.queries[i].results[j];
        const values = result.values;

        if (values.length === 0) continue;

        let oldTimestamp = values[0][0];
        for (let k = 0; k < values.length; k++) {
          const value = values[k];
          const ts = value[0];
          let state = value[1];

          if (state === 'None') {
            state = 0;
          }

          if (state === 'Idle') {
            state = 1;
          }

          series[this.states[state]][day] += (ts - oldTimestamp) / 1000 / 3600;
          oldTimestamp = ts;
        }
      }
    }
  }

  async getKairosDbMetricNames(headers): Promise<string[]> {
    const headersRequest = {
      Authorization: headers.authorization, // afaik this one is not needed
    };

    const { data } = await firstValueFrom(
      this.httpService.get(
        'https://development.industry-fusion.com/tsdb/api/v1/metricnames',
        { headers: headersRequest },
      ),
    );
    return data.results;
  }

  async getMachinePower(headers, assetIds): Promise<any> {
    const headersRequest = {
      Authorization: headers.authorization, // afaik this one is not needed
    };

    const today = new Date();
    const enddate = new Date(today).getTime();
    // const startdate = today.setHours(0, 0, 0, 0);
    const startdate = today.setDate(today.getDate() - 2);

    const assets = await this.assetService.findByIds(assetIds);

    const metrics = [];

    assets.map((asset) => {
      metrics.push({
        name: `default\\${asset.metadata['base-objects-v0.1-ifric-identification-urn-id'].value}\\http://www.industry-fusion.org/fields#base-objects-v0.1-power-supply-runtime-electric-power`,
        aggregators: [
          {
            name: 'avg',
            sampling: {
              value: 30,
              unit: 'minutes',
            },
          },
        ],
      });
      metrics.push({
        name: `default\\${asset.metadata['base-objects-v0.1-ifric-identification-urn-id'].value}\\http://www.industry-fusion.org/fields#base-objects-v0.1-power-supply-runtime-electric-power-l1`,
        aggregators: [
          {
            name: 'avg',
            sampling: {
              value: 30,
              unit: 'minutes',
            },
          },
        ],
      });
      metrics.push({
        name: `default\\${asset.metadata['base-objects-v0.1-ifric-identification-urn-id'].value}\\http://www.industry-fusion.org/fields#base-objects-v0.1-power-supply-runtime-electric-power-l2`,
        aggregators: [
          {
            name: 'avg',
            sampling: {
              value: 30,
              unit: 'minutes',
            },
          },
        ],
      });
      metrics.push({
        name: `default\\${asset.metadata['base-objects-v0.1-ifric-identification-urn-id'].value}\\http://www.industry-fusion.org/fields#base-objects-v0.1-power-supply-runtime-electric-power-l3`,
        aggregators: [
          {
            name: 'avg',
            sampling: {
              value: 30,
              unit: 'minutes',
            },
          },
        ],
      });
    });

    const query = {
      start_absolute: startdate,
      end_absolute: enddate,
      metrics: metrics,
    };

    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://development.industry-fusion.com/tsdb/api/v1/datapoints/query',
        query,
        { headers: headersRequest },
      ),
    );

    const timestamps = {};
    const co2PerKwh = 8.0833333;

    //TODO: User KairosDBQueryDto
    for (let i = 0; i < data.queries.length; i++) {
      for (let j = 0; j < data.queries[i].results.length; j++) {
        const result = data.queries[i].results[j];
        for (let k = 0; k < result.values.length; k++) {
          const value = result.values[k];
          const ts = value[0];
          let power = value[1];

          //TODO this should be solved by machine connection
          if (power === 'None') power = 0;

          const co2 = power * co2PerKwh;
          if (!timestamps[ts]) {
            timestamps[ts] = { ts, power: power, co2: co2 };
          } else {
            timestamps[ts].power += power;
            timestamps[ts].co2 += co2;
          }
        }
      }
    }

    const series = {
      power: [],
      co2: [],
      timestamps: [],
    };

    const tsNames = Object.getOwnPropertyNames(timestamps).sort();

    for (let i = 0; i < tsNames.length; i++) {
      series.power.push(timestamps[tsNames[i]].power);
      series.co2.push(timestamps[tsNames[i]].co2);
      series.timestamps.push(timestamps[tsNames[i]].ts);
    }

    return series;
  }

  async getRuntimeMetrics(
    headers,
    asset,
    runtime,
    startdate,
    enddate,
  ): Promise<any> {
    const metrics = [];

    Object.getOwnPropertyNames(runtime).map((r) => {
      metrics.push({
        name: `default\\${asset.metadata['base-objects-v0.1-ifric-identification-urn-id'].value}\\http://www.industry-fusion.org/fields#${r}`,
        aggregators: [
          {
            name: 'avg',
            sampling: {
              value: 15,
              unit: 'seconds',
            },
          },
        ],
      });
    });

    const query = {
      start_absolute: startdate,
      end_absolute: enddate,
      metrics: metrics,
    };

    const headersRequest = {
      Authorization: headers.authorization, // afaik this one is not needed
    };

    // console.log(query);

    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://development.industry-fusion.com/tsdb/api/v1/datapoints/query',
        query,
        { headers: headersRequest },
      ),
    );
    const res = data as KairosDBQueryDto;

    const ret = {};

    for (const q in res.queries) {
      if (res.queries[q].sample_size == 0) continue;

      for (const r in res.queries[q].results) {
        const result = res.queries[q].results[r];
        const metricName = result.name.split('#')[1];
        if (result.group_by[0].type != 'number') continue;

        ret[metricName] = {
          values: result.values,
        };
      }
    }

    return ret;
  }

  async getMachineState(headers, asset, startdate, enddate): Promise<any> {
    const metrics = [
      {
        name: `default\\${asset.metadata['base-objects-v0.1-ifric-identification-urn-id'].value}\\http://www.industry-fusion.org/fields#base-objects-v0.1-operation-conditions-runtime-machine-state`,
        aggregators: [
          {
            name: 'last',
            sampling: {
              value: 15,
              unit: 'seconds',
            },
          },
        ],
      },
    ];

    const query = {
      start_absolute: startdate,
      end_absolute: enddate,
      metrics: metrics,
    };

    const headersRequest = {
      Authorization: headers.authorization, // afaik this one is not needed
    };

    // console.log(query);

    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://development.industry-fusion.com/tsdb/api/v1/datapoints/query',
        query,
        { headers: headersRequest },
      ),
    );
    const res = data as KairosDBQueryDto;

    res.queries[0].results[0].values = res.queries[0].results[0].values.map(
      (value) => {
        return this.states[value[1]];
      },
    );

    return res;
  }
}
