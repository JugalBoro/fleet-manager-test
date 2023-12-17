import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { Asset } from '../../schemas/mongodb/asset.schema';
import { AuthGuard } from 'nest-keycloak-connect';
import { ObjectId } from 'mongoose';

@Controller('assets')
@UseGuards(AuthGuard)
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  getAssets(): Promise<Asset[]> {
    return this.assetService.findAll();
  }

  @Get('/:id')
  getAsset(@Param('id') id: string): Promise<Asset> {
    return this.assetService.findById(id);
  }

  @Put('update/:id')
  update(
    @Param('id') id: ObjectId,
    @Body() asset: Asset,
  ): Promise<Asset | null> {
    return this.assetService.updateOne(id, asset);
  }

  @Post('create')
  create(@Body() asset: Asset): Promise<Asset> {
    return this.assetService.createOne(asset);
  }

  @Delete('delete/:id')
  deleteOne(@Param('id') id: string) {
    return this.assetService.deleteOne(id);
  }

  @Put('remove/file/:fileId')
  removeFileFromAsset(
    @Param('fileId') fileId: ObjectId,
    @Body() { assetId, fieldId }: { assetId: ObjectId; fieldId: ObjectId },
  ) {
    return this.assetService.removeFileFromAsset({
      assetId,
      fileId,
    });
  }

  /**
   * Only use this function if you want to delete all assets.
   * Uncommented by default.
   */

  // @Delete('delete/all')
  // deleteAll() {
  //   return this.assetService.deleteAll();
  // }

  /**
   * Only use this function if you want to remove the files key from all assets.
   * Uncommented by default.
   */

  // @Get('remove/files/all')
  // removeFilesKeyFromAllAssets() {
  //   return this.assetService.removeFilesKeyFromAllAssets();
  // }
}
