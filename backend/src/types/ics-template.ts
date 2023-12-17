import { IcsField } from './ics-field';

export interface IcsTemplate {
  $schema: string;
  $schemaVersion: string;
  $id: string;
  title: string;
  description: string;
  visible?: boolean;
  type: string;
  group?: string;
  properties: any;
}

export interface IcsTemplateRef {
  $ref: string;
  type: string;
  title?: string;
}

export interface IcsTemplateProperties {
  $id: string;
  title: string;
  description: string;
  visible?: boolean;
  properties: IcsField[];
}
