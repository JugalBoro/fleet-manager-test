import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { UploadComponent } from './upload/upload.component';
import { FilesStore } from '../../services/store/files/files.store';
import { AssetsStore } from '../../services/store/assets/assets.store';
import { first } from 'rxjs';
import { UploadFilesService } from '../../services/api/upload-files/upload-files.service';
import { environment } from '../../../environments/environment';
import { FieldId, Ids, MongoId } from '../../model/ids';
import { ManageAssetsService } from '../../services/api/manage-assets/manage-assets.service';

@Component({
  selector: 'infus-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css'],
  imports: [
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    CommonModule,
    UploadComponent,
    FileUploadModule,
  ],
  standalone: true,
})
export class FieldsComponent implements OnInit {
  @HostBinding('class') public class = 'infus-fields';
  @Input() public field: any;
  @Input() public icsTemplateDescription: any;
  @Input() public parentForm: FormGroup = {} as FormGroup;

  initialFiles: any[] = [];
  environmentUrl = environment.url + '/';

  private currentAsset;

  constructor(
    private fileStore: FilesStore,
    private assetStore: AssetsStore,
    private fileService: UploadFilesService,
    private manageAssetService: ManageAssetsService
  ) {}

  ngOnInit(): void {
    const { id }: { id: FieldId } = this.field;
    const currentFieldId = id;

    // TODO: REFACTOR THIS AT ALL COSTS
    // maybe move to store
    // maybe as component input without direct access to api service

    // TODO: Unsubscribe after first load
    /**
     * Fetch current asset
     * Fetch all fileIds that belong to this asset
     * Push files to initialFiles array
     */
    this.assetStore.currentAsset$.subscribe((asset) => {
      const metadata = asset.metadata as object;
      const currentFileIds: Ids[] = metadata?.['fileIds'];

      // console.log('FIELDS | currentFileIds', currentFileIds);

      this.currentAsset = asset;
      this.initialFiles = [];

      if (!currentFileIds) return;

      /**
       * Iterate over all current fileIds
       */
      currentFileIds.forEach((currentFileId) => {
        const { fieldId, _id } = currentFileId;
        const fileId = _id;

        /**
         * If fieldId matches current fieldId, fetch file by fileId
         */
        if (fieldId === currentFieldId) {
          this.fileService
            .fetchFileById(fileId)
            .pipe(first())
            .subscribe((file) => {
              /**
               * If file is null
               *  - remove fileId reference from asset
               *  - fetch asset again to update metadata
               */
              if (!file) {
                this.manageAssetService
                  .removeFileFromAsset(this.currentAsset._id, fileId, fieldId)
                  .pipe(first())
                  .subscribe(() => {
                    console.log(
                      'FIELDS | file removed from asset',
                      this.currentAsset._id,
                      fileId,
                      fieldId
                    );
                    this.assetStore.getAssetList();
                  });
              } else {
                /**
                 * If file exists, remove files without fileId
                 */
                this.initialFiles.filter((file) => {
                  // console.log('FIELDS | file', file);
                  return file._id;
                });

                /**
                 * If file exists, push file to initialFiles array
                 * This will be used to display the files in the frontend
                 */
                this.initialFiles.push({ ...file?.data, _id: fileId });

                // console.log('FIELDS | initialFiles', this.initialFiles);
              }
            });
        }
      });
    });
  }

  onUpload(event, fieldId) {
    let { files } = event;

    /**
     * Add fieldId and assetId to files array
     */

    files = files.map((file) => {
      file.fieldId = fieldId;
      file.assetId = this.currentAsset._id;
      return file;
    });

    /**
     * check if files array contains files that
     * - have been fetched on init
     * - have been stored in files array
     * if so, remove them
     */

    files = files.filter(
      (file) =>
        !this.initialFiles.some(
          (uploadedFile) =>
            uploadedFile.name === file.name &&
            uploadedFile.size === file.size &&
            uploadedFile.type === file.type &&
            uploadedFile.assetId === file.assetId &&
            uploadedFile.fieldId === file.fieldId
        )
    );

    if (!files) return;

    /**
     * upload files to storage
     * add fileIds to files store
     */

    for (const file of files) {
      this.initialFiles.push(file);
      this.fileStore.uploadFile(file, event);
    }

    // console.log('FIELDS | initialFiles', this.initialFiles);

    this.assetStore.getAssetList();
  }

  onRemoveFile(event) {
    // TODO: Maybe remove from storage
    this.initialFiles.splice(this.initialFiles.indexOf(event), 1);

    const fileId = event._id;
    const assetId = event.assetId;
    const fieldId = event.fieldId;

    if (!fileId) return;

    this.fileService
      .deleteFileById(fileId)
      .pipe(first())
      .subscribe((response) => {
        this.manageAssetService
          .removeFileFromAsset(assetId, fileId, fieldId)
          .pipe(first())
          .subscribe(() => this.assetStore.getAssetList());
      });

    this.assetStore.getAssetList();
  }
}
