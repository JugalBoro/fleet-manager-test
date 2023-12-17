import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldId, MongoId } from '../../../model/ids';
import { UploadFilesService } from '../../api/upload-files/upload-files.service';

@Injectable({
  providedIn: 'root',
})
export class FilesStore {
  public currentFileIds: {
    _id: MongoId;
    fieldId: FieldId;
    assetId: MongoId;
  }[] = [];
  public currentFileIds$: Subject<
    { _id: MongoId; fieldId: FieldId; assetId: MongoId; files?: any[] }[]
  > = new Subject();

  constructor(private uploadFileService: UploadFilesService) {}

  public setcurrentFileIds(
    fileId: {
      _id: MongoId;
      fieldId: FieldId;
      assetId: MongoId;
      files: any[];
    } | null
  ) {
    if (!fileId) {
      console.log('emptied');
      this.currentFileIds = [];
      this.currentFileIds$.next(this.currentFileIds);
      return;
    }
    const { _id, fieldId, assetId } = fileId;

    if (_id && fieldId && assetId) {
      this.currentFileIds.push(fileId);
    }

    this.currentFileIds$.next(this.currentFileIds);
    console.log('FILES STORE | currentFileIds', this.currentFileIds, fieldId);
  }

  public removeFile(fileId: {
    _id: MongoId;
    fieldId: FieldId;
    assetId: MongoId;
  }) {
    this.currentFileIds = this.currentFileIds.filter(
      (file) => file._id !== fileId._id
    );
    this.currentFileIds$.next(this.currentFileIds);
  }

  public uploadFile(file: File, event: any) {
    // console.log('FILES STORE | uploadFile', file, event);

    const { fieldId, assetId } = file as any;

    this.uploadFileService
      .uploadFile(file, fieldId, assetId)
      .subscribe((response: any) => {
        event.onUpload?.emit({
          originalEvent: event.originalEvent,
          files: event.files,
        });
        this.setcurrentFileIds({
          _id: response?.body?._id,
          fieldId,
          assetId,
          files: event.files,
        });
      });
  }
}
