import { Component, HostBinding, OnInit } from '@angular/core';
import { GridColService } from '../../services/grid-col.service';
import { AssetsStore } from '../../services/store/assets/assets.store';
import { MetricsService } from '../../services/api/metrics/metrics.service';
import { DateTime } from 'luxon';
import { finalize, lastValueFrom } from 'rxjs';
import { ManageAssetsService } from '../../services/api/manage-assets/manage-assets.service';

const transformDate = (timestamp: string) =>
  DateTime.fromISO(new Date(timestamp).toISOString()).toFormat('ff');

interface TimeRange {
  name: string;
  code: string;
}

@Component({
  selector: 'infus-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @HostBinding('class') class = 'infus-page';

  machines!: TimeRange[];
  selectedMachines: TimeRange[] = [];

  selectedTimerangesAvailabilityChart!: TimeRange[];
  timerangesAvailabilityChart!: TimeRange[];
  selectedTimerangesEfficiencyChart!: TimeRange[];
  timerangesEfficiencyChart!: TimeRange[];

  panelData: any = null;

  groupedStateChartOptions: any = {};
  bufGroupedStateChartOptions: any = {
    legend: {
      top: 8,
      data: [],
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: 8,
      right: 16,
      bottom: 8,
      top: 40,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: [],
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    series: [
      {
        color: ['#aa3333'],
        name: 'Offline',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [],
      },
      {
        color: ['#00b04f'],
        name: 'Run',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [],
      },
      {
        color: ['#ffbf00'],
        name: 'Online_Maintenance',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [],
      },
      {
        color: ['#FF6259'],
        name: 'Online_Error',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [],
      },
      {
        color: ['#BDBDBD'],
        name: 'Online_Idle',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [],
      },
      {
        //color: ['#BDBDBD'],
        name: 'Setup',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [],
      },
      {
        //color: ['#BDBDBD'],
        name: 'Testing',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [],
      },
    ],
  };

  powerMetricsChartOptions: any = {};
  genPowerMetricsChartOptions() {
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Power', 'CO2 Emissions'],
      },
      xAxis: {
        type: 'category',
        data: [],
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {},
      },
      grid: {
        left: 144,
        right: 24,
        bottom: 32,
        top: 48,
      },
      yAxis: [
        {
          name: 'Power',
          type: 'value',
          position: 'left',
          splitNumber: 4,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: '{value} kW',
          },
        },
        {
          name: 'CO2 Emissions',
          type: 'value',
          position: 'left',
          offset: 80,
          axisLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: '{value} kg',
          },
        },
      ],
      series: [
        {
          name: 'Power',
          data: [],
          type: 'line',
          yAxisIndex: 1,
        },
        {
          name: 'CO2 Emissions',
          data: [],
          type: 'line',
        },
      ],
    };
  }

  loading = {
    metrics: true,
  };

  emptyState = {
    chart: true,
  };

  constructor(
    private gridColService: GridColService,
    public assetsStore: AssetsStore,
    private metricsService: MetricsService,
    private assetService: ManageAssetsService
  ) {
    this.machines = [
      { name: 'Machine 1', code: 'machine-1' },
      { name: 'Machine 2', code: 'machine-2' },
      { name: 'Machine 3', code: 'machine-3' },
      { name: 'Machine 4', code: 'machine-4' },
      { name: 'Machine 5', code: 'machine-5' },
    ];
    this.timerangesAvailabilityChart = [
      { name: 'Letzte 5 Tage', code: 'last-5-days' },
      { name: 'Letzte 4 Wochen', code: 'last-4-weeks' },
      { name: 'Letzte 6 Monate', code: 'last-6-months' },
      { name: 'Letzte 5 Jahre', code: 'last-5-years' },
    ];
    this.timerangesEfficiencyChart = [
      { name: 'Last 30 minutes', code: 'last-30-minutes' },
      { name: 'Last hour', code: 'last-hour' },
      { name: 'Today', code: 'today' },
      { name: 'Yesterday', code: 'yesterday' },
      { name: 'This week', code: 'this-week' },
      { name: 'This month', code: 'this-month' },
      { name: 'This year', code: 'this-year' },
      { name: 'Last month', code: 'last-month' },
      { name: 'Last year', code: 'last-year' },
    ];
  }

  async ngOnInit() {
    const self = this;
    this.assetsStore.assets$.subscribe((data) => {
      this.machines = data.map((asset) => {
        return {
          name: asset.metadata['base-objects-v0.1-machine-identification-alias']
            .value,
          code: asset.metadata['base-objects-v0.1-machine-identification-alias']
            .value,
        };
      });

      const assetIds = assets.map((asset) => {
        return asset._id;
      });

      this.fetchGroupStateMetrics(assetIds, this);
      this.fetchPowerMetrics(assetIds, this);
    });

    const assets = await lastValueFrom(this.assetService.fetchAssets());

    const assetIds = assets.map((asset) => {
      return asset._id;
    });

    this.powerInterval = setInterval(
      this.fetchPowerMetrics,
      5000,
      assetIds,
      this
    );

    this.stateInterval = setInterval(
      this.fetchGroupStateMetrics,
      5000,
      assetIds,
      this
    );

    this.assetsStore.getAssetList();
  }

  stateInterval: any;

  fetchGroupStateMetrics(assetIds: any[], self) {
    self.metricsService
      .fetchGroupStateMetrics(assetIds)
      .pipe(finalize(() => (self.loading.metrics = false)))
      .subscribe((data) => {
        if (Object.keys(data).length > 0) {
          self.emptyState.chart = false;
        }
        data.series.forEach((element) => {
          self.bufGroupedStateChartOptions.legend?.data.push(element.name);
          self.bufGroupedStateChartOptions.series?.forEach((serie) => {
            if (serie.name === element.name) {
              serie.data = element.data.filter((d) => d !== 0);
            }
          });
        });

        self.bufGroupedStateChartOptions.xAxis.data = data.timestamps.map(
          (value) => {
            return transformDate(value);
          }
        );

        self.groupedStateChartOptions = self.bufGroupedStateChartOptions;
      });
  }

  powerInterval: any;

  fetchPowerMetrics(assetIds: any[], self) {
    self.metricsService.fetchPowerMetrics(assetIds).subscribe((data) => {
      let options = self.genPowerMetricsChartOptions();
      options.series[0].data = data.power;
      options.series[1].data = data.co2;
      const buf: any = data.timestamps.map((value) => {
        return transformDate(value);
      });
      options.xAxis.data = buf;
      self.powerMetricsChartOptions = options;
    });
  }

  columnDefs = this.gridColService.getColDef([
    'activity-status',
    'base-objects-v0.1-machine-identification-alias',
    'base-objects-v0.1-machine-identification-product-name',
    'templateCategory',
    'base-objects-v0.1-ifric-identification-asset-manufacturer-name',
    'base-objects-v0.1-machine-identification-asset-serial-number',
    'creationDate',
    'manageGridAssetActions',
  ]);
  rowData = this.assetsStore.assetsMetadata$;

  public getPanelData(data) {
    this.panelData = data;
  }

  ngOnDestroy() {
    clearInterval(this.powerInterval);
    clearInterval(this.stateInterval);
    console.log('destroyed');
  }
}
