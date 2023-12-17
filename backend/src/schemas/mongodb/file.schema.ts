import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
  @Prop({ required: true, type: Object })
  data: unknown;
}

export const FileSchema = SchemaFactory.createForClass(File);
