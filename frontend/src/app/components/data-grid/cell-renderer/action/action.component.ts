import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { MessageStore } from '../../../../services/store/message/message.store';
import { AssetsStore } from '../../../../services/store/assets/assets.store';
import { SidebarStore } from '../../../../services/store/sidebar/sidebar.store';
import { IcsTemplatesStore } from '../../../../services/store/ics-templates/ics-templates.store';
import { Router } from '@angular/router';

@Component({
  selector: 'infus-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
  standalone: true,
  imports: [ButtonModule, RippleModule, MenuModule],
  providers: [MessageStore],
})
export class ActionComponent implements ICellRendererAngularComp {
  public cellValue = '';
  public params;

  public items: MenuItem[];

  constructor(
    // TODO: Move this to upper level
    private messageStore: MessageStore,
    private assetsStore: AssetsStore,
    private sidebarStore: SidebarStore,
    private icsTemplatesStore: IcsTemplatesStore,
    private router: Router
  ) {
    this.items = [];
  }

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.cellValue = this.getValueToDisplay(params);
    this.messageStore.getMessage();

    this.items = [
      {
        label: 'Details',
        items: [
          {
            label: 'Analyze',
            disabled: this.params?.data?.manageGridAssetActions?.value,
            icon: 'pi pi-chart-pie',
            command: () => {
              this.router.navigate(['/dashboard/' + this.params.data._id]);
            },
          },
        ],
      },
      {
        label: 'Manage',
        items: [
          {
            label: 'Edit',
            disabled: this.params?.data?.manageGridAssetActions?.value,
            icon: 'pi pi-pencil',
            command: () => {
              this.assetsStore.crudMode$.next('edit');
              this.assetsStore.getAssetById(this.params?.data?._id);
              this.icsTemplatesStore.getIcsTemplateById(
                this.params.data.templateId?.value
              );
              this.sidebarStore.store = { isOpen: true, id: 'MANAGE_ASSETS' };
            },
          },
          {
            label: 'Duplicate',
            disabled: this.params?.data?.manageGridAssetActions?.value,
            icon: 'pi pi-copy',
            command: () => {
              this.assetsStore.crudMode$.next('duplicate');
              this.icsTemplatesStore.getIcsTemplateById(
                this.params.data.templateId?.value
              );
              this.assetsStore.getAssetById(this.params?.data?._id);
              this.sidebarStore.store = { isOpen: true, id: 'MANAGE_ASSETS' };
            },
          },
          {
            label: 'Delete',
            disabled: this.params?.data?.manageGridAssetActions?.value,
            icon: 'pi pi-times',
            command: () => {
              const id = this.params.data._id;
              this.assetsStore.deleteAsset(id);
              this.messageStore.setMessage({
                severity: 'success',
                detail: `${
                  // TODO: Centralize all "machine-identification-" strings with enum
                  this.params.data[
                    'base-objects-v0.1-machine-identification-alias'
                  ]?.value || 'Asset'
                } deleted!`,
              });
            },
          },
        ],
      },
    ];
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  getValueToDisplay(params: ICellRendererParams): string {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}
