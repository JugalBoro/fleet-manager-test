import { Injectable } from '@nestjs/common';
import { IdentificationDto } from './identification.dto';

@Injectable()
export class IdentificationService {
  async getIdentifications(id: string): Promise<IdentificationDto> {
    const identifications: IdentificationDto = {
      alias: {
        type: 'text',
        required: true,
      },
      assetName: {
        type: 'text',
        required: true,
      },
      status: {
        type: 'text',
        visible: true,
      },
      assetNumber: {
        type: 'text',
        required: false,
      },
      category: {
        type: 'text',
        required: false,
        readonly: true,
      },
      manufacturer: {
        type: 'text',
        required: false,
      },
      serialNumber: {
        type: 'text',
        required: false,
      },
      creationDate: {
        type: 'date',
        required: false,
      },
      year: {
        type: 'number',
        required: false,
      },
      busSystem: {
        type: 'text',
        required: false,
      },
    };
    return identifications;
  }
}
