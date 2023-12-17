import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
import { TagComponent } from '../tag/tag.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'infus-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  standalone: true,
  imports: [AgGridModule, TagComponent],
})
export class GridComponent {
  @Input()
  columnDefs: ColDef[] = [];

  @Input()
  rowData: any[] | null = [];

  private colId: string | undefined;

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  sendRowData(data: any) {
    this.notifyParent.emit(data);
  }

  private currentNodeId: string | undefined;

  public defaultColDef: ColDef = {
    editable: false,
    floatingFilter: true,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
      suppressFilter: true,
    },
    suppressMenu: true,
    sortable: true,
    flex: 1,
    minWidth: 150,
    filter: true,
    resizable: true,
    cellStyle: (params) => ({
      display: 'flex',
      alignItems: 'center',
    }),
  };

  public onRowClicked(event: RowClickedEvent) {
    const { node } = event;
    const { id, data } = node;

    if (this.colId === 'manageGridAssetActions') return;

    if (this.currentNodeId === id) {
      node.setSelected(false);
      this.sendRowData(null);
      this.currentNodeId = undefined;
    } else {
      this.setColHeaderNames();
      node.setSelected(true);
      this.sendRowData(data);
      this.currentNodeId = id;
    }
  }

  public onCellClicked(event: any) {
    this.colId = event.colDef.field;
  }

  private setColHeaderNames(): void {
    this.columnDefs.map((col) => (col.headerName ? col.headerName : col.field));
  }
}
