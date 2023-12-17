import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Parameter } from '../../../schemas/mongodb/parameter.schema';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class ParameterService {
  constructor(
    @InjectModel(Parameter.name)
    private parameterModel: Model<Parameter>,
    private readonly httpService: HttpService,
  ) {}

  async createOne(createParametersDto: Parameter): Promise<Parameter> {
    const createdParameters = new this.parameterModel(createParametersDto);
    return createdParameters.save();
  }

  findById(id: string): Observable<AxiosResponse<any[]>> {
    // TODO: fix id
    const temporaryId = 'urn:ngsi-ld:asset:2:8';
    return this.httpService.get(
      `https://development.industry-fusion.com/scorpio/ngsi-ld/v1/entities/${temporaryId}?options=keyValues`,
    );
  }
}
