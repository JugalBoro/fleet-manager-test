import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';
import { Observable } from 'rxjs';
import { Parameter } from '../../../schemas/mongodb/parameter.schema';
import { ParameterService } from './parameter.service';
import { AxiosResponse } from 'axios';

@Controller('assets/parameter')
@UseGuards(AuthGuard)
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}

  @Get('/:id')
  findById(
    @Param('id') id: string,
    @AuthenticatedUser() user: any = null,
  ): Observable<AxiosResponse<any[]>> {
    return this.parameterService.findById(id);
  }

  @Post('create')
  create(@Body() parameter: Parameter): Promise<Parameter> {
    return this.parameterService.createOne(parameter);
  }
}
