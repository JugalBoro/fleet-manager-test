import { IcsTemplateDescriptionDto } from './icsTemplateDescription.dto';

export interface IcsTemplateGraphDto {
  data: IcsTemplateDescriptionDto;
  children: IcsTemplateGraphDto[];
}
