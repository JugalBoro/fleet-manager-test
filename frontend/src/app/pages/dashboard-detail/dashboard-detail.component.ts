import {
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MetricsService } from '../../services/api/metrics/metrics.service';
import { AssetsStore } from '../../services/store/assets/assets.store';
import { ActivatedRoute } from '@angular/router';
import { Asset } from '../../model/asset';
import { ManageAssetsService } from '../../services/api/manage-assets/manage-assets.service';
import { DateTime } from 'luxon';
import { finalize } from 'rxjs';
import { UploadFilesService } from '../../services/api/upload-files/upload-files.service';

const transformTime = (timestamp: string) =>
  DateTime.fromISO(new Date(timestamp).toISOString()).toFormat('HH:mm');

const transformDate = (timestamp: string) =>
  DateTime.fromISO(new Date(timestamp).toISOString()).toFormat('ff');

interface TimeRange {
  name: string;
  code: string;
}

@Component({
  selector: 'infus-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.css'],
})
export class DashboardDetailComponent implements OnInit {
  @HostBinding('class') class = 'infus-page';

  constructor(
    private metricsService: MetricsService,
    private assetsStore: AssetsStore,
    private route: ActivatedRoute,
    private assetService: ManageAssetsService,
    private fileService: UploadFilesService
  ) {}

  stateOptions: any[] = [];

  groupedStateChartOption: any = {};
  bufGroupedStateChartOption: any = {
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

  value = '';

  selectedTimerangesAvailabilityChart!: TimeRange[];
  timerangesAvailabilityChart!: TimeRange[];

  selectedTimerangesProcessChart!: TimeRange[];
  timerangesProcessChart!: TimeRange[];

  chartOption = {};

  processChart = {};

  asset: Asset = {} as Asset;
  assetAlias = '';
  assetId: string = '';
  metrics: any = {};
  machineIcon = '';

  loading = {
    metrics: true,
  };

  emptyState = {
    chart: true,
  };

  mySelf = this;

  stateInterval: any = {};
  processInterval: any = {};

  getAssetVars(md: string) {
    if (!this.asset.metadata) return '';

    return this.asset.metadata[md].value;
  }

  ngOnInit() {
    const assetId = this.route.snapshot.paramMap.get('id') || '';
    this.assetId = assetId;

    this.assetService.fetchAssetById(assetId).subscribe((asset) => {
      this.asset = asset;
      this.assetAlias =
        asset.metadata['base-objects-v0.1-machine-identification-alias'].value;
      this.fileService
        .fetchMultipleFilesByIds(
          asset.metadata['fileIds'].map((f) => {
            return {
              _id: f._id,
              fieldId: f.fieldId,
              assetId: f.assetId,
              fileId: f._id,
            };
          })
        )
        .subscribe((files) => {
          let file =
            files.filter((f) => {
              if (
                f.file.data.fieldId ===
                'base-objects-v0.1-machine-identification-product-icon'
              )
                return f;
            }) || '';

          this.machineIcon = file[0]?.file?.data?.path;
        });
    });

    this.loadGroupedStateChartData(assetId, this);
    this.stateInterval = setInterval(
      this.loadGroupedStateChartData,
      5000,
      assetId,
      this
    );

    this.loadProcessChartData(assetId, this);
    this.processInterval = setInterval(
      this.loadProcessChartData,
      5000,
      assetId,
      this
    );

    this.timerangesAvailabilityChart = [
      { name: 'Letzte 5 Tage', code: 'last-5-days' },
      { name: 'Letzte 4 Wochen', code: 'last-4-weeks' },
      { name: 'Letzte 6 Monate', code: 'last-6-months' },
      { name: 'Letzte 5 Jahre', code: 'last-5-years' },
    ];
    this.timerangesProcessChart = [
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

  getBufProcessChart(
    series: {
      name: string;
      data: [];
      xAxisData?: [];
      markLine?: any;
    }[]
  ): any {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: '{a0} <strong>{c0}</strong>',
      },
      grid: {
        left: 48,
        right: 48,
        bottom: 32,
        top: 50,
      },
      xAxis: {
        type: 'category',
        data: series[0].xAxisData,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: true,
        },
        axisLabel: {},
      },
      yAxis: [
        {
          type: 'value',
          position: 'left',
          splitNumber: 4,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: series[0].name,
          data: series[0]?.data,
          color: '#6366F1',
          type: 'line',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#DCDDFC',
                },
                {
                  offset: 0.6,
                  color: '#fff',
                },
              ],
              global: false,
            },
          },
          markLine: series[0].markLine,
        },
        {
          name: series[1].name,
          data: series[1].data,
          type: 'bar',
        },
      ],
    };
  }

  setBufProcessChart(metric): void {
    const markLine = {
      data: [],
    } as any;

    if (metric?.min) {
      markLine.data.push({
        symbol: 'none',
        name: 'min line',
        type: 'min',
        lineStyle: {
          normal: {
            type: 'solid',
            color: 'red',
          },
        },
        yAxis: metric.min,
      });
    }

    if (metric?.max) {
      markLine.data.push({
        symbol: 'none',
        name: 'max line',
        type: 'max',
        lineStyle: {
          normal: {
            type: 'solid',
            color: 'red',
          },
        },
        yAxis: metric.max,
      });
    }
    this.chartOption = this.getBufProcessChart([
      {
        name: metric?.name,
        data: metric?.values.map((value) => value[1]),
        xAxisData: metric?.values.map((value) => transformTime(value[0])),
        markLine,
      },
      { name: 'Status', data: metric?.state },
    ]);
    console.log('chartOption', this.chartOption);
  }

  onChange(event) {
    this.setBufProcessChart(this.metrics[event]);
  }

  loadGroupedStateChartData(assetId: string, self: any) {
    self.metricsService.fetchGroupStateMetrics([assetId]).subscribe((data) => {
      data.series.forEach((element) => {
        self.bufGroupedStateChartOption.legend?.data.push(element.name);
        self.bufGroupedStateChartOption.series?.forEach((serie) => {
          if (serie.name === element.name) {
            let data = element.data.filter((v) => {
              return v != 0;
            });
            if (data.length > 0) serie.data = element.data;
          }
        });
      });

      self.bufGroupedStateChartOption.xAxis.data = data.timestamps.map(
        (value) => {
          return transformDate(value);
        }
      );

      self.groupedStateChartOption = self.bufGroupedStateChartOption;
    });
  }

  metricstime = 1;

  setMetricstime(time: number) {
    this.metricstime = time;
    this.loadProcessChartData(this.assetId, this);
  }

  loadProcessChartData(assetId: string, self: any) {
    const startdate = Date.now() - 1000 * 60 * 60 * self.metricstime;
    const enddate = Date.now(); // 1 hour

    self.metricsService
      .fetchMetrics(assetId, startdate, enddate)
      .subscribe((data) => {
        if (Object.keys(data).length > 0) {
          self.emptyState.chart = false;
        }

        if (Object.getOwnPropertyNames(self.metrics).length === 0) {
          const [key] = Object.keys(data);

          self.value = key;
        }

        self.metrics = data;
        self.setBufProcessChart(self.metrics[self.value]);
        const stateOptionBuf: any = [];
        for (const metric of Object.getOwnPropertyNames(self.metrics)) {
          stateOptionBuf.push({
            label: self.metrics[metric].name,
            value: metric,
          });
        }

        self.stateOptions = stateOptionBuf;
      });
  }

  ngOnDestroy() {
    clearInterval(this.processInterval);
    clearInterval(this.stateInterval);
    console.log('destory');
  }
}
