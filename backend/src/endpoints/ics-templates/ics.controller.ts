import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IcsService } from './ics.service';
import { IcsTemplateDescriptionDto } from './icsTemplateDescription.dto';
import { IcsTemplateGraphDto } from './icsTemplateGraph.dto';
import { IcsTemplateDto } from './icsTemplate.dto';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

@Controller('ics')
@UseGuards(AuthGuard)
export class IcsController {
  constructor(private readonly iscService: IcsService) {}

  @Get('templates')
  getIcsTemplateDescriptions(): Promise<IcsTemplateDescriptionDto[]> {
    return this.iscService.getIcsTemplateDescriptions();
  }

  @Get('templates/:id')
  getIcsTemplate(
    @Param('id') id: string,
    @AuthenticatedUser() user: any = null,
  ): Promise<IcsTemplateDto> {
    return this.iscService.getIcsTemplate(id);
  }

  // @Get('templates/graph/:id')
  // getIcsTemplateGraph(
  //   @Param('id') id: string,
  //   @AuthenticatedUser() user: any = null,
  // ): Promise<IcsTemplateGraphDto> {
  //   return this.iscService.getIcsTemplateGraph(id);
  // }
}
