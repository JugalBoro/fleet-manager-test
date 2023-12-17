import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { Asset } from '../../schemas/mongodb/asset.schema';
import { SchemaFactory, getModelToken } from '@nestjs/mongoose';

describe('AppController', () => {
  let assetController: AssetController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [
        AssetService,
        {
          provide: getModelToken(Asset.name),
          useValue: SchemaFactory.createForClass(Asset),
        },
      ],
    }).compile();

    assetController = app.get<AssetController>(AssetController);
  });

  describe('root', () => {
    it('should return an asset template', () => {
      const res = assetController.getAssets();
      Promise.resolve(res).then((value) => {
        expect(value).toBeInstanceOf(Array);
      });
    });
  });
});
