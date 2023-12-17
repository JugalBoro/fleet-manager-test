import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { ParameterDto } from './parameter.dto';
import { AuthGuard } from 'nest-keycloak-connect';

@Controller('ics/templates/parameters')
@UseGuards(AuthGuard)
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}

  @Get(':id')
  getParametersParameters(@Param('id') id: string): Promise<ParameterDto> {
    return this.parameterService.getParameters(id);
  }
}
