export interface Notification {
  id: string;
  timestamp: string;
  title: string;
  text: string;
  type: 'ok' | 'warning' | 'machine-warning' | 'machine-error';
  status: 'read' | 'unread';
  machine?: {
    id: string;
    assetName: string;
    alias: string;
  };
  group: string;
}
