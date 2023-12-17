import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { IcsService } from './endpoints/ics-templates/ics.service';
import { IcsController } from './endpoints/ics-templates/ics.controller';
import { ParameterModule } from './endpoints/asset/parameter/parameter.module';
import { ParameterService } from './endpoints/ics-templates/parameters/parameter.service';
import { ParameterController } from './endpoints/ics-templates/parameters/parameter.controller';
import { IdentificationService } from './endpoints/ics-templates/identification/identification.service';
import { IdentificationController } from './endpoints/ics-templates/identification/identification.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { SignInController } from './endpoints/sign-in/sign-in.controller';
import { SignInService } from './endpoints/sign-in/sign-in.service';
import { MetricsController } from './endpoints/metrics/metrics.controller';
import { MetricsService } from './endpoints/metrics/metrics.service';
import { FileModule } from './endpoints/file/file.module';
import { AlertsService } from './endpoints/alerts/alerts/alerts.service';
import { AlertsController } from './endpoints/alerts/alerts/alerts.controller';

import {
  AssetTimeSchema,
  AssetTimeSeries,
} from './schemas/mongodb/asset-time-series.schema';
import {
  KeycloakConnectModule,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { Asset, AssetSchema } from './schemas/mongodb/asset.schema';
import { AssetService } from './endpoints/asset/asset.service';
import { AssetController } from './endpoints/asset/asset.controller';

// const mongoURI =
//   process.env.NODE_ENV === 'production'
//     ? config.mongoURI.production
//     : config.mongoURI.development;

const mongoURI = process.env.MONGO_URL;

const authServerUrl = 'https://development.industry-fusion.com/auth';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
    ConfigModule.forRoot(),
    ParameterModule,
    MongooseModule.forRoot(mongoURI),
    HttpModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: AssetTimeSeries.name, schema: AssetTimeSchema },
      { name: Asset.name, schema: AssetSchema },
    ]),
    KeycloakConnectModule.register({
      authServerUrl,
      realm: 'iff',
      clientId: 'fleet-manager-backend',
      secret: 'VNTXViwo6QOm8picq6cIC2Tbi3gICsnO',
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.OFFLINE,
    }),
    FileModule,
  ],
  controllers: [
    AppController,
    IcsController,
    ParameterController,
    IdentificationController,
    SignInController,
    MetricsController,
    AssetController,
    AlertsController,
  ],
  providers: [
    IcsService,
    ParameterService,
    IdentificationService,
    SignInService,
    MetricsService,
    AssetService,
    AlertsService,
  ],
})
export class AppModule {}
