import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { File } from '../../schemas/mongodb/file.schema';
import { extname } from 'path';
import { S3 } from 'aws-sdk';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<File>,
  ) {}

  async fileUpload(file): Promise<any> {
    // some logic here
    // e.g. check if PDF really is a PDF (not just a file with .pdf extension)
    const { fieldId, assetId } = file;

    // Generate a unique suffix for the file key
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    // Initialize the S3 client with your IONOS S3 credentials
    const s3 = new S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      endpoint: process.env.S3_URL, // Replace YOUR_REGION with the actual region
    });

    // Example bucket name
    const bucketName = process.env.S3_BUCKET;

    // Generate the key using the unique suffix and original file extension
    const key =
      file.fieldname + '-' + uniqueSuffix + extname(file.originalname);

    // Upload the file to IONOS S3
    const s3UploadParams = {
      Body: file.buffer,
      Bucket: bucketName,
      Key: key,
    };

    try {
      await s3.upload(s3UploadParams).promise();
    } catch (err) {
      throw new Error(`Error uploading file to IONOS S3: ${err}`);
    }

    const newFile = {
      data: {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        filename: key,
        path: s3.endpoint.href + bucketName + '/' + key,
        size: file.size,
        fieldId,
        assetId,
      },
    };

    return this.createOne(newFile);
  }

  async createOne(file): Promise<any> {
    const createdFile = new this.fileModel(file);
    return createdFile.save();
  }

  async deleteFileById(id: ObjectId): Promise<any> {
    return await this.fileModel.findByIdAndDelete(id);
  }

  async findById(id: ObjectId): Promise<any> {
    return await this.fileModel.findById(id);
  }

  async findMultipleByIds(ids: string): Promise<any> {
    const deserializedIds = JSON.parse(ids);

    const mappedIds = deserializedIds.map((id) => id.fileId);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    // find all files based on mappedIds and modify the response to include the fieldId and assetId
    async function combineIds() {
      const files = await self.fileModel.find({
        _id: { $in: mappedIds },
      });
      return files.map((file) => {
        const fileId = file._id.valueOf();
        const assetId = deserializedIds.find(
          (id) => id.fileId === fileId,
        ).assetId;
        const fieldId = deserializedIds.find(
          (id) => id.fileId === fileId,
        ).fieldId;

        return {
          fileId,
          fieldId,
          assetId,
          file,
        };
      });
    }

    return await combineIds();
  }
}
