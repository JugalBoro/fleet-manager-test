import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParameterController } from './parameter.controller';
import {
  Parameter,
  ParameterSchema,
} from '../../../schemas/mongodb/parameter.schema';
import { ParameterService } from './parameter.service';
import { HttpModule } from '@nestjs/axios';
import {
  KeycloakConnectModule,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';

const authServerUrl = 'https://development.industry-fusion.com/auth';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Parameter.name, schema: ParameterSchema },
    ]),
    KeycloakConnectModule.register({
      authServerUrl,
      realm: 'iff',
      clientId: 'fleet-manager-backend',
      secret: 'VNTXViwo6QOm8picq6cIC2Tbi3gICsnO',
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.OFFLINE,
    }),
  ],
  controllers: [ParameterController],
  providers: [ParameterService],
})
export class ParameterModule {}
