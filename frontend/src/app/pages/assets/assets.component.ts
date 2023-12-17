import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IcsTemplateDescription,
  IcsTemplateDto,
} from './../../model/ics-template';
import { AssetsStore } from '../../services/store/assets/assets.store';
import { IcsTemplatesStore } from '../../services/store/ics-templates/ics-templates.store';
import { SidebarStore } from '../../services/store/sidebar/sidebar.store';
import { FetchIcsTemplatesService } from '../../services/api/fetch-ics-templates/fetch-ics-templates.service';
import { GridColService } from '../../services/grid-col.service';

@Component({
  selector: 'infus-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
})
export class AssetsComponent implements OnInit {
  @HostBinding('class') class = 'infus-page';
  icsTemplateDescription$: Observable<IcsTemplateDescription[]> =
    new Observable<IcsTemplateDescription[]>();
  sidebarVisible = false;
  sidebarManageAssetsVisible = false;
  panelData: any = null;
  icsTemplate$: Observable<IcsTemplateDto> | null = null;
  currentIcsTemplate$: Observable<IcsTemplateDto> | null = null;

  selectedIcsTemplateDescription: IcsTemplateDescription | null = null;

  constructor(
    private gridColService: GridColService,
    private fetchIcsTemplatesService: FetchIcsTemplatesService,
    private icsTemplatesStore: IcsTemplatesStore,
    public sidebarStore: SidebarStore,
    public assetsStore: AssetsStore
  ) {}

  columnDefs = this.gridColService.getColDef([
    'status',
    'base-objects-v0.1-machine-identification-alias',
    'base-objects-v0.1-machine-identification-product-name',
    'templateCategory',
    'base-objects-v0.1-ifric-identification-asset-manufacturer-name',
    'base-objects-v0.1-machine-identification-asset-serial-number',
    'creationDate',
    'base-objects-v0.1-machine-identification-manufacturing-year',
    'base-objects-v0.1-machine-identification-asset-communication-protocol',
    'manageGridAssetActions',
  ]);
  rowData = this.assetsStore.assetsMetadata$;

  ngOnInit(): void {
    // TODO: KEEP THIS SHIT in line 44 (currenticstemplate$)
    // Only currentIcsTemplate$ from store should be here
    this.currentIcsTemplate$ = this.icsTemplatesStore.currentIcsTemplate$;
    this.assetsStore.getAssetList();
    this.icsTemplatesStore.getIcsTemplateDescriptionList();
    this.icsTemplateDescription$ =
      this.icsTemplatesStore.icsTemplateDescription$;
    // TODO: This shit is doubled
    // Solve via object literal
    // const sidebar = {['SELECT_ICS_TEMPLATES']: false, ['MANAGE_ASSETS']: false}
    // const getSidebar = (type) => {this.sidebar[type]}
    // getSidebar('SELECT_ICS_TEMPLATES')
    this.sidebarStore.getStore$.subscribe((store) => {
      this.sidebarVisible = store.filter(
        (item) => item.id === 'SELECT_ICS_TEMPLATES'
      )[0]?.isOpen;
    });
    // TODO: REMOVE THIS SHIT
    // and handle by store instead of stupidly fetching the api service directly
    this.icsTemplatesStore.currentIcsTemplateDescription$.subscribe(
      (icsTemplateDescription) => {
        this.icsTemplate$ = this.fetchIcsTemplatesService.fetchIcsTemplates(
          icsTemplateDescription?.id
        );
        this.selectedIcsTemplateDescription = icsTemplateDescription;
      }
    );
    // TODO: This shit is doubled
    this.sidebarStore.getStore$.subscribe((store) => {
      this.sidebarManageAssetsVisible = store.filter(
        (item) => item.id === 'MANAGE_ASSETS'
      )[0]?.isOpen;
    });
  }

  public getPanelData(data) {
    this.panelData = data;
  }

  public handleCreateAsset() {
    this.sidebarStore.store = { isOpen: true, id: 'SELECT_ICS_TEMPLATES' };
    this.assetsStore.crudMode$.next('create');
  }

  public isObject(value: any): boolean {
    return typeof value === 'object';
  }
}
