import { IcsField } from './ics-field';

export interface IcsTemplateDescription {
  _id: string;
  id: string;
  name: string;
  description: string;
  group: string;
  metadata?: unknown;
}

export interface IcsTemplateDto {
  template: {
    title: string;
    description: string;
  };
  metadata: {
    title: string;
    description: string;
    properties: IcsField[];
  };
  parameters: {
    title: string;
    description: string;
    properties: IcsField[];
  };
}
