import { Injectable, NotFoundException } from '@nestjs/common';
import { IcsTemplateDescriptionDto } from './icsTemplateDescription.dto';
//import IcsTemplatesDescriptions from '../../schemas/json-schema/ics_template_descriptions.json';
// import IcsTemplates from '../../schemas/json-schema/ics_templates.json';
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import { IcsTemplateGraphDto } from './icsTemplateGraph.dto';
import { IcsTemplateDto } from './icsTemplate.dto';
import {
  IcsTemplate,
  IcsTemplateRef,
  IcsTemplateProperties,
} from './../../types/ics-template';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class IcsService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getIcsTemplateDescriptions(): Promise<IcsTemplateDescriptionDto[]> {
    const ics_service_url = this.configService.get<string>('ICS_SERVICE_URL');
    const ics_token = this.configService.get<string>('ICS_SERVICE_TOKEN');

    const headersRequest = {
      Authorization: 'Basic ' + ics_token,
      'Content-Type': 'application/json',
    };

    const url = ics_service_url + '/asset_templates';
    const { data } = await lastValueFrom(
      this.httpService.get(url, {
        headers: headersRequest,
      }),
    );

    const templateDescriptions: IcsTemplateDescriptionDto[] = [];

    for (let i = 0; i < data.length; i++) {
      const templateDescription = data[i];
      templateDescriptions.push({
        id: Buffer.from(templateDescription.id).toString('base64'),
        icsId: templateDescription.id,
        name: templateDescription.title,
        description: templateDescription.description,
        group: templateDescription.group,
        metadata: templateDescription.metadata,
      });
    }

    return templateDescriptions;
  }

  async getIcsTemplate(id: string, visible = false): Promise<IcsTemplateDto> {
    const ics_service_url = this.configService.get<string>('ICS_SERVICE_URL');
    const ics_token = this.configService.get<string>('ICS_SERVICE_TOKEN');

    const headersRequest = {
      Authorization: 'Basic ' + ics_token,
      'Content-Type': 'application/json',
    };

    //ics id
    const icsId = Buffer.from(id, 'base64').toString('ascii');
    const { data } = await firstValueFrom(
      this.httpService.get(ics_service_url + '/asset_templates_deep/' + icsId, {
        headers: headersRequest,
      }),
    );

    const icsTemplate: IcsTemplateDto = {
      template: {
        title: null,
        description: null,
      },
      metadata: {
        title: null,
        description: null,
        properties: [],
      },
      parameters: {
        title: null,
        description: null,
        properties: [],
      },
    };

    const template = data as IcsTemplate[];
    icsTemplate.template.title = template[0].title;
    icsTemplate.template.description = template[0].description;
    icsTemplate;

    const metadata = this.getProperties(
      template[0].properties.metadata,
      data,
      visible,
    );
    const parameters = this.getProperties(
      template[0].properties.parameters,
      data,
      visible,
    );

    icsTemplate.metadata = metadata;
    icsTemplate.parameters = parameters;

    return icsTemplate;
  }

  // async getIcsTemplateGraph(id: string): Promise<IcsTemplateGraphDto> {
  //   for (let i = 0; i < IcsTemplates.length; i++) {
  //     const icsTemplate: IcsTemplate = IcsTemplates[i];
  //     if (sha256(icsTemplate.$id).toString(CryptoJS.enc.Hex) === id) {
  //       const graph = this.getRelationsShipsRecursive(
  //         icsTemplate,
  //         IcsTemplates,
  //       );

  //       return graph;
  //     }
  //   }

  //   return {
  //     data: {
  //       id: null,
  //       icsId: null,
  //       name: 'Not found',
  //       description: 'Not found',
  //       group: 'Not found',
  //       metadata: {
  //         type: 'Not found',
  //       },
  //     },
  //     children: [],
  //   };
  // }

  getProperties(
    parentTemplate: IcsTemplateRef,
    icsTemplateFromRest: IcsTemplate[],
    visible = false,
  ) {
    const icsTemplate: IcsTemplate = this.findTemplateByRef(
      parentTemplate.$ref,
      icsTemplateFromRest,
    );

    // TODO: Maybe more precise (string[])
    // This is a list of object keys
    // I am not sure whether these objects are IFF standards
    const keys: string[] = Object.keys(icsTemplate.properties);

    const props: IcsTemplateProperties = {
      title: icsTemplate.title,
      description: icsTemplate.description,
      $id: icsTemplate.$id,
      properties: [],
    };

    for (let i = 0; i < keys.length; i++) {
      const ref: IcsTemplateRef = icsTemplate.properties[keys[i]];
      const subTemplate: IcsTemplate = this.findTemplateByRef(
        ref.$ref,
        icsTemplateFromRest,
      );

      if (subTemplate == undefined) continue;

      // TODO: Check if we need this stuff in dashboard
      // Maybe this should not be removed but just not displayed
      if (subTemplate?.visible === true || visible == true) {
        const propertiesHeader: IcsTemplateProperties = {
          $id: subTemplate.$id,
          title: subTemplate.title,
          description: subTemplate.description,
          visible: icsTemplate.visible,
          properties: [],
        };
        props.properties.push(propertiesHeader);

        // TODO: Maybe more precise (string[])
        // This is a list of object keys
        // I am not sure whether these objects are IFF standards
        const properties: string[] = Object.keys(subTemplate.properties);

        for (let j = 0; j < properties.length; j++) {
          const p = properties[j];

          propertiesHeader.properties.push({
            id: subTemplate.properties[p].id,
            name: subTemplate.properties[p].title,
            type: subTemplate.properties[p].type,
            unit: subTemplate.properties[p].unit,
            description: subTemplate.properties[p].description,
            placeholder: subTemplate.properties[p].placeholder,
            readonly: subTemplate.properties[p].readOnly,
            visible: subTemplate.properties[p].visible,
            contentMediaType: subTemplate.properties[p].contentMediaType,
            contentEncoding: subTemplate.properties[p].contentEncoding,
            enum: subTemplate.properties[p].enum?.map((e) => ({
              name: e,
              code: e,
            })),
            properties: subTemplate.properties[p].properties,
            // TODO: add required property
          });
        }
      }
    }

    return props;
  }

  getRelationsShipsRecursive(
    parentTemplate: IcsTemplate,
    deep: IcsTemplate[],
  ): IcsTemplateGraphDto {
    const icsTemplate: IcsTemplate = this.findTemplateById(
      parentTemplate.$id,
      deep,
    );

    const graph: IcsTemplateGraphDto = {
      data: {
        id: null,
        icsId: null,
        name: icsTemplate.title,
        description: icsTemplate.description,
        group: icsTemplate.group,
        metadata: {
          type: icsTemplate.type,
        },
      },
      children: [],
    };

    if (icsTemplate.properties.relationships == undefined) return graph;

    const parentRelations = this.findTemplateByRef(
      icsTemplate.properties.relationships.$ref,
      deep,
    );

    const relations = Object.keys(parentRelations.properties);
    for (let k = 0; k < relations.length; k++) {
      const relation = parentRelations.properties[relations[k]];

      if (relation.type == 'array') {
        const subTemplate = this.findTemplateByRef(relation.items.$ref, deep);
        graph.children.push(this.getRelationsShipsRecursive(subTemplate, deep));
      } else {
        const subTemplate = this.findTemplateByRef(relation.items.$ref, deep);
        graph.children.push(this.getRelationsShipsRecursive(subTemplate, deep));
      }
    }

    return graph;
  }

  findTemplateById(id: string, deep: IcsTemplate[]): IcsTemplate {
    for (let i = 0; i < deep.length; i++) {
      const template = deep[i];
      if (template.$id === id) {
        return template;
      }
    }
  }

  findTemplateByRef(ref: string, deep: IcsTemplate[]): IcsTemplate {
    const r = ref.replace('.json', '');
    for (let i = 0; i < deep.length; i++) {
      const template = deep[i];
      if (template.$id === r) {
        return template;
      }
    }
  }

  // findTemplateByHash(id: string, deep: IcsTemplate[]): IcsTemplate {
  //   for (let i = 0; i < deep.length; i++) {
  //     const template = deep[i];
  //     if (sha256(template.$id).toString(CryptoJS.enc.Hex) === id) {
  //       return template;
  //     } else {
  //       // throw new NotFoundException();
  //     }
  //   }
  // }
}
