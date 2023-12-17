import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Subject } from 'rxjs';
import { ManageAssetsService } from '../../api/manage-assets/manage-assets.service';
import { Asset } from '../../../model/asset';
import { UploadFilesService } from '../../api/upload-files/upload-files.service';
import { FieldId, Ids, MongoId } from '../../../model/ids';
import { uniqueIdsArray } from '../../../util/uniqueArray';
import { substractArrays } from '../../../util/substractArrays';

@Injectable({
  providedIn: 'root',
})
export class AssetsStore {
  public assets$: Subject<Asset[]> = new Subject();
  public assetsMetadata$: Subject<unknown[]> = new Subject();
  public assetsParameters$: Subject<unknown[]> = new Subject();
  public assetsAmount$: Subject<number> = new Subject();
  public currentAssetId$: BehaviorSubject<string> = new BehaviorSubject('');
  public currentAsset$: BehaviorSubject<Asset> = new BehaviorSubject(
    {} as Asset
  );
  public crudMode$: BehaviorSubject<string> = new BehaviorSubject('create');
  private attachements: {
    assetId: MongoId;
    fileId: MongoId;
    fieldId: FieldId;
    file: any;
  }[] = [];
  private fileIds: Ids[] = [];

  constructor(
    private assetsService: ManageAssetsService,
    private fileService: UploadFilesService
  ) {}

  public getAssetList(): void {
    this.assetsService
      .fetchAssets()
      .pipe(first())
      .subscribe((assets: Asset[]) => {
        const parameterList = assets.map((asset) => {
          const parameters = asset.parameters as object;

          if (parameters) {
            Object.assign(parameters, { _id: asset._id });
          }

          return parameters;
        });

        const metadataList = assets.map((asset) => {
          const metadata = asset.metadata as object & { fileIds?: Ids[] };

          if (metadata?.fileIds) {
            console.log(
              'ASSETS STORE | fileIds from BACKEND',
              asset._id,
              metadata['fileIds']
            );
          }

          if (metadata) Object.assign(metadata, { _id: asset._id });

          Object.assign(metadata, { attachements: [] });

          // Get all fileIds from all assets
          for (const fileId of metadata?.fileIds || []) {
            this.fileIds.push(fileId);
          }

          // remove duplicates from fileIds
          this.fileIds = uniqueIdsArray(this.fileIds);

          // map fileIds to match backend structure
          this.fileIds = this.fileIds.map((element) => {
            const { _id, fieldId, assetId } = element;
            const fileId = _id;
            return { _id, fieldId, assetId, fileId };
          });

          metadata.fileIds = this.fileIds;

          return metadata;
        });

        /**
         * Attachments
         * This is requesting files from the backend for each asset
         * and attaching them to the asset metadata
         */

        this.fileService
          .fetchMultipleFilesByIds(this.fileIds || [])
          .pipe(first())
          .subscribe((files) => {
            console.log('ASSETS STORE | Fetch files by IDs', this.fileIds);
            const filesWithoutAttachements = substractArrays(
              this.fileIds,
              files
            );

            /**
             * Remove fileIds from assets that are not in the database
             */
            filesWithoutAttachements?.forEach((file) => {
              const { assetId, fileId, fieldId } = file;
              this.assetsService
                .removeFileFromAsset(assetId, fileId, fieldId)
                .subscribe();
            });

            files.forEach((fileData) => {
              const { assetId, fileId, fieldId, file } = fileData;
              const attachement = {
                assetId,
                fileId,
                fieldId,
                file,
              };
              this.attachements.push(attachement);
            });

            this.attachements.forEach((attachement) => {
              metadataList.map((entry) => {
                const metadata = entry as object;
                if (attachement.assetId === metadata['_id']) {
                  metadata['attachements'].push(attachement);
                }
              });
            });

            this.assets$.next(assets);
            this.assetsMetadata$.next(metadataList);
            this.assetsParameters$.next(parameterList);
            this.assetsAmount$.next(assets.length);
          });
      });
  }

  public getAssetById(id: string): void {
    this.assetsService.fetchAssetById(id).subscribe((asset: Asset) => {
      this.currentAssetId$.next(asset._id!);
      this.currentAsset$.next(asset);
    });
  }

  public updateAssetById(id: string, asset: Asset): void {
    this.assetsService.updateAssetById(id, asset).subscribe((asset: Asset) => {
      this.currentAssetId$.next(asset._id!);
      this.currentAsset$.next(asset);
    });
  }

  public deleteAsset(id: string): void {
    this.assetsService.deleteAsset(id).subscribe(() => {
      this.getAssetList();
    });
  }
}
