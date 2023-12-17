import { Test, TestingModule } from '@nestjs/testing';
import { IcsController } from './ics.controller';
import { IcsService } from './ics.service';

describe('IcsController', () => {
  let controller: IcsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IcsController],
      providers: [IcsService],
    }).compile();

    controller = module.get<IcsController>(IcsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
