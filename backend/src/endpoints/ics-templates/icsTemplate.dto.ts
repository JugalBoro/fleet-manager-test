import { IcsField } from './../../types/ics-field';

export interface IcsTemplateDto {
  template: {
    title: string;
    description: string;
  };
  metadata: {
    title: string;
    description: string;
    // $id: string;
    // visible: boolean;
    properties: IcsField[];
  };
  parameters: {
    title: string;
    description: string;
    // $id: string;
    // visible: boolean;
    properties: IcsField[];
  };
}
