import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'infus-image',
  template: `
    <div class="flex flex-row gap-2 items-center">
      <img
        *ngIf="path"
        [src]="path"
        style="border-radius: 50%;"
        width="40"
        height="40"
        alt="alt"
        title="title"
      />
      <span>{{ cellValue }}</span>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class ImageComponent implements ICellRendererAngularComp {
  public cellValue = '';
  public path = '';
  public environment = environment.url;
  private colId;
  private assetId;

  agInit(params: ICellRendererParams) {
    // get cellrendererparams context
    this.colId = params?.context;
    this.assetId = params?.data?._id;
    this.cellValue = this.getValueToDisplay(params);

    if (!this.colId) return;
    if (!params.data?.attachements) return;

    const filteredAsset = params.data.attachements.filter((attachement) => {
      const { assetId, fieldId } = attachement;
      return assetId === this.assetId && fieldId === this.colId;
    });

    this.path = filteredAsset[0]?.file?.data.path;
    console.log(
      'IMAGE |',
      this.assetId,
      { data: params.data },
      'attachements:',
      params.data.attachements.length
    );
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  getValueToDisplay(params: ICellRendererParams): string {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}
