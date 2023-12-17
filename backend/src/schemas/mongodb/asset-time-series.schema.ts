import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type AssetTimeSeriesDocument = HydratedDocument<AssetTimeSeries>;

@Schema({
  timeseries: {
    timeField: 'time',
    metaField: 'key',
    granularity: 'seconds',
  },
  expireAfterSeconds: 60 * 60 * 24 * 7, // 7 days
})
export class AssetTimeSeries {
  public _id: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  public key: any;

  @Prop()
  public value: number;

  @Prop()
  public time: Date;
}

export const AssetTimeSchema = SchemaFactory.createForClass(AssetTimeSeries);
