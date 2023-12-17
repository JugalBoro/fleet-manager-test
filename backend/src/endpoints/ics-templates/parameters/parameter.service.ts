import { Injectable } from '@nestjs/common';
import { ParameterDto } from './parameter.dto';

@Injectable()
export class ParameterService {
  async getParameters(id: string): Promise<ParameterDto> {
    const parameters: ParameterDto = {
      measurements: [
        {
          id: '1',
          name: 'height',
          type: 'number',
          required: false,
          unit: 'mm',
          properties: [],
        },
        {
          id: '2',
          name: 'width',
          type: 'number',
          required: false,
          unit: 'mm',
          properties: [],
        },
        {
          id: '3',
          name: 'length',
          type: 'number',
          required: false,
          unit: 'mm',
          properties: [],
        },
        {
          id: '4',
          name: 'weight',
          type: 'number',
          required: false,
          unit: 'kg',
          properties: [],
        },
      ],
    };
    return parameters;
  }
}
