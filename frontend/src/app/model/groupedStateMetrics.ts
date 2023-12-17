export interface GroupedStateMetrics {
  series: GroupedStateMetric[];
  timestamps: string[];
}

export interface GroupedStateMetric {
  name: string;
  data: number[];
}
