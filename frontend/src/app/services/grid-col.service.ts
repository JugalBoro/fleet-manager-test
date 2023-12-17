import { Injectable } from '@angular/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { DateTime } from 'luxon';
import { ActionComponent } from '../components/data-grid/cell-renderer/action/action.component';
import { AssetStatusComponent } from '../components/data-grid/cell-renderer/asset-status';
import { ImageComponent } from '../components/data-grid/cell-renderer/image';
import { OperationStatusComponent } from '../components/data-grid/cell-renderer/operation-status';

const transformDate = (date: Date) =>
  DateTime.fromISO(date.toISOString()).toFormat('dd.MM.yyyy');
const transformString = (string: string) =>
  DateTime.fromISO(string).toFormat('dd.MM.yyyy');

@Injectable({
  providedIn: 'root',
})
export class GridColService {
  colDefs: ColDef[] = [
    {
      field: 'status',
      headerName: 'Status',
      maxWidth: 140,
      filter: 'agSetColumnFilter',
      suppressMenu: true,
      suppressMovable: true,
      valueGetter: (params) => {
        return this.getFieldValue(params);
      },
      cellRendererSelector: (params: ICellRendererParams) => {
        const { data } = params;
        if (
          data?.status?.value === 'Incomplete' ||
          data?.status?.value === 'Complete'
        )
          return {
            component: AssetStatusComponent,
          };

        return undefined;
      },
      sort: 'desc',
      sortIndex: 0,
      pinned: 'left',
    },
    {
      field: 'activity-status',
      headerName: 'Activity',
      maxWidth: 140,
      filter: 'agSetColumnFilter',
      suppressMenu: true,
      suppressMovable: true,
      valueGetter: (params) => {
        return this.getFieldValue(params) || 'Running';
      },
      cellRendererSelector: (params: ICellRendererParams) => {
        const { data } = params;
        if (
          data?.status?.value === 'Running' ||
          data?.status?.value === 'Error' ||
          data?.status?.value === 'Idle' ||
          data?.status?.value === 'Maintenance' ||
          // TODO: Remove this line after data integration
          data?.status?.value == 'Incomplete'
        )
          return {
            component: OperationStatusComponent,
          };

        return undefined;
      },
      sort: 'desc',
      sortIndex: 0,
      pinned: 'left',
    },
    {
      field: 'base-objects-v0.1-machine-identification-alias',
      headerName: 'Alias',
      valueGetter: (params) => {
        return this.getFieldValue(params);
      },
    },
    {
      field: 'base-objects-v0.1-machine-identification-product-name',
      headerName: 'Asset name',
      valueGetter: (params) => {
        return this.getFieldValue(params);
      },
      cellRendererSelector: () => {
        return {
          component: ImageComponent,
        };
      },
      cellRendererParams: (params) => {
        return {
          context: 'base-objects-v0.1-machine-identification-product-icon',
        };
      },
    },
    {
      field: 'templateCategory',
      headerName: 'Category',
      valueGetter: (params) => {
        return this.getFieldValue(params);
      },
    },
    {
      field: 'base-objects-v0.1-ifric-identification-asset-manufacturer-name',
      filter: 'agSetColumnFilter',
      headerName: 'Manufacturer',
      valueGetter: (params) => {
        return this.getFieldValue(params);
      },
      cellRendererSelector: () => {
        return {
          component: ImageComponent,
        };
      },
      cellRendererParams: (params) => {
        return {
          context: 'base-objects-v0.1-ifric-identification-logo-manufacturer',
        };
      },
    },
    {
      field: 'base-objects-v0.1-machine-identification-manufacturing-year',
      headerName: 'Manufacturer year',
      valueGetter: (params) => {
        return this.getFieldValue(params);
      },
    },
    {
      field: 'base-objects-v0.1-machine-identification-asset-serial-number',
      headerName: 'Serial number',
      valueGetter: (params) => {
        return this.getFieldValue(params);
      },
    },
    {
      field: 'creationDate',
      sort: 'desc',
      sortIndex: 1,
      filter: 'agDateColumnFilter',
      valueGetter: (params) => {
        return this.getFieldValue(params);
      },
      filterParams: {
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          const dateAsString = cellValue;
          if (dateAsString == null) return -1;
          if (
            transformDate(filterLocalDateAtMidnight) ===
            transformString(dateAsString)
          ) {
            return 0;
          }
          return -1;
        },
      },
      cellRenderer: (data: any) => {
        return data?.value ? transformString(data?.value) : '';
      },
    },
    {
      field:
        'base-objects-v0.1-machine-identification-asset-communication-protocol',
      filter: 'agSetColumnFilter',
      headerName: 'Communication protocol',
      valueGetter: (params) => {
        return this.getFieldValue(params);
      },
    },
    {
      field: 'manageGridAssetActions',
      headerName: 'Actions',
      maxWidth: 90,
      suppressMenu: true,
      suppressMovable: true,
      filter: false,
      sortable: false,
      pinned: 'right',
      valueGetter: (params) => {
        return this.getFieldValue(params);
      },
      cellStyle: (params) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }),
      cellRendererSelector: (params: ICellRendererParams) => {
        return {
          component: ActionComponent,
          params,
        };
      },
    },
  ];

  getColDef(list: string[]): ColDef[] {
    return this.colDefs.filter((col) => list.includes(col.field!));
  }

  private getFieldValue(params): string {
    const { data, colDef } = params;
    if (typeof data?.[colDef.field]?.value === 'object') {
      return data?.[colDef.field]?.value?.name;
    }
    return data?.[colDef.field]?.value;
  }
}
