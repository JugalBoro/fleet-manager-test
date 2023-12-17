import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssetDocument = HydratedDocument<Asset>;

@Schema()
export class Asset {
  // @Prop({ required: true, type: String })
  // _id: string;

  @Prop({ required: true, type: Object })
  metadata: { [key: string]: any };

  @Prop({ required: true, type: Object })
  parameters: { [key: string]: any };
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
