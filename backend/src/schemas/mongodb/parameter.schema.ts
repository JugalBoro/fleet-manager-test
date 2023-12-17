import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ParameterDocument = HydratedDocument<Parameter>;

@Schema()
export class Parameter {
  @Prop({ required: false })
  height: string;

  @Prop({ required: false })
  width: string;

  @Prop({ required: false })
  length: string;

  @Prop({ required: false })
  weight: string;
}

export const ParameterSchema = SchemaFactory.createForClass(Parameter);
