import { Asset } from 'src/schemas/mongodb/asset.schema';

export class AlertsDto {
  alerts: AlertDto[];
  autoRefresh: boolean;
  lastTime: string;
  more: false;
  page: number;
  pageSize: number;
  status: string;
  total: number;
}

export class AlertDto {
  id: string;
  createTime: string;
  severity: string;
  status: string;
  text: string;
  timeout: number;
}

export class NotificationDto {
  id: string;
  title: string;
  text: string;
  machine: NotificationMachineDto;
  type: string;
  status: string;
  timestamp: string;
  group: string;
}

export class NotificationMachineDto {
  alias: string;
  assetName: string;
  // id: string;
}
