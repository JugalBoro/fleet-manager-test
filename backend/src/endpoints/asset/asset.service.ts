import { Model, ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Asset } from '../../schemas/mongodb/asset.schema';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset.name)
    private assetModel: Model<Asset>,
  ) {}

  async createOne(createAssetDto: Asset): Promise<Asset> {
    if (Object.keys(createAssetDto.metadata).length === 0) {
      createAssetDto.metadata = {
        initiallyEmpty: true,
      };
    }
    const createdAsset = new this.assetModel(createAssetDto);
    return createdAsset.save();
  }

  async updateOne(id: ObjectId, updateAssetDto: Asset): Promise<Asset | null> {
    const updatedAsset = await this.assetModel.findByIdAndUpdate(
      id,
      updateAssetDto,
      { new: true },
    );
    return updatedAsset;
  }

  async findAll(): Promise<Asset[]> {
    return await this.assetModel.find();
  }

  async findById(id: string): Promise<Asset> {
    return await this.assetModel.findById(id);
  }

  async findByUrn(urn: string): Promise<Asset> {
    return await this.assetModel.findOne({
      'metadata.base-objects-v0.1-ifric-identification-urn-id': urn,
    });
  }

  async findByIds(ids: string[]): Promise<Asset[]> {
    return await this.assetModel.find({ _id: { $in: ids } });
  }

  async deleteOne(id: string): Promise<Asset> {
    return await this.assetModel.findByIdAndRemove(id);
  }

  async removeFileFromAsset({ assetId, fileId }): Promise<Asset | null> {
    const asset = await this.assetModel.findById(assetId);
    const updatedAsset = await this.assetModel.findByIdAndUpdate(
      assetId,
      {
        'metadata.fileIds': (asset as any)?.metadata?.fileIds.filter((file) => {
          return file.fileId !== fileId;
        }),
      },
      { new: true },
    );

    try {
      return updatedAsset;
    } catch (error) {
      console.log(error);
      return asset;
    }
  }

  /**
   * Only use this function if you want to remove the files key from all assets.
   */

  async removeFilesKeyFromAllAssets(): Promise<Asset | null> {
    const assets = await this.assetModel.find();
    assets.forEach(async (asset) => {
      const updatedAsset = await this.assetModel.updateMany(
        {},
        { $unset: { 'metadata.fileIds': 1 } },
        { new: true },
      );
      return updatedAsset;
    });
    return null;
  }

  /**
   * Only use this function if you want to delete all assets.
   */

  async deleteAll(): Promise<any> {
    return await this.assetModel.deleteMany({});
  }
}
