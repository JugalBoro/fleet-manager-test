import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import {
  KeycloakConnectModule,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './../../schemas/mongodb/file.schema';

const authServerUrl = 'https://development.industry-fusion.com/auth';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    KeycloakConnectModule.register({
      authServerUrl,
      realm: 'iff',
      clientId: 'fleet-manager-backend',
      secret: 'VNTXViwo6QOm8picq6cIC2Tbi3gICsnO',
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.OFFLINE,
    }),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
