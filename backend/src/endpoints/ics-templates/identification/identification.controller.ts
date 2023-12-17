import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { IdentificationDto } from './identification.dto';
import { AuthGuard } from 'nest-keycloak-connect';

@Controller('ics/templates/identification')
@UseGuards(AuthGuard)
export class IdentificationController {
  constructor(private readonly identificationService: IdentificationService) {}

  @Get(':id')
  getIdentificationsIdentifications(
    @Param('id') id: string,
  ): Promise<IdentificationDto> {
    return this.identificationService.getIdentifications(id);
  }
}
