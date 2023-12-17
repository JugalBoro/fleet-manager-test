export interface IcsTemplateDescriptionDto {
  id: string;
  icsId: string;
  name: string;
  description: string;
  group: string;
  metadata: { [key: string]: string };
}
