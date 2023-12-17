import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'infus-operation-status',
  template: ` <p-tag
    [rounded]="true"
    [value]="cellValue || 'N/A'"
    [style]="getTagStyles()"
  />`,
  standalone: true,
  imports: [TagModule],
})
export class OperationStatusComponent implements ICellRendererAngularComp {
  public cellValue = '';

  agInit(params: ICellRendererParams) {
    this.cellValue = this.getValueToDisplay(params);
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  getTagStyles() {
    return this.cellValue === 'Running'
      ? {
          border: '1px solid var(--green-500)',
          background: 'var(--green-50)',
          color: 'var(--green-600)',
        }
      : {
          border: '1px solid var(--bluegray-500)',
          background: 'var(--bluegray-50)',
          color: 'var(--bluegray-500)',
        };
  }

  getValueToDisplay(params: ICellRendererParams): string {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}
