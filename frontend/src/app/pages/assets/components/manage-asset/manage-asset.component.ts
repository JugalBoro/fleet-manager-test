import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { ManageAssetsService } from '../../../../services/api/manage-assets/manage-assets.service';
import { Measurement } from '../../../../model/parameters/measurement';
import { SidebarStore } from '../../../../services/store/sidebar/sidebar.store';
import { MessageStore } from '../../../../services/store/message/message.store';
import { AssetsStore } from '../../../../services/store/assets/assets.store';
import {
  IcsTemplateDescription,
  IcsTemplateDto,
} from './../../../../model/ics-template';
import { RecursiveFormGroupComponent } from './components/recursive-form-group/recursive-form-group.component';
import { IcsTemplatesStore } from '../../../../services/store/ics-templates/ics-templates.store';
import { Asset } from '../../../../model/asset';
import { FilesStore } from '../../../../services/store/files/files.store';
import { Ids } from '../../../../model/ids';
import { uniqueIdsArray } from '../../../../util/uniqueArray';

@Component({
  selector: 'infus-manage-asset',
  templateUrl: './manage-asset.component.html',
  styleUrls: ['./manage-asset.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    RecursiveFormGroupComponent,
    AccordionModule,
  ],
})
export class ManageAssetComponent implements OnInit {
  @Input() parameters: { measurements: Measurement[] } | null = {
    measurements: [],
  };
  @Input() icsTemplate: IcsTemplateDto | null = null;
  @Input() selectedIcsTemplateDescription: IcsTemplateDescription | null = null;

  public form: FormGroup = new FormGroup({});
  public formControls: any = {};
  public isLoading = false;
  public keepOriginalOrder = (a, b) => a.key;
  private mappedMetadata = [];
  private mappedAsset = {};
  private asset: Asset = {
    metadata: {},
    parameters: {},
  };
  private crudMode = '';
  private assetId: string | undefined;
  private currentFileIds: Ids[] = [];

  constructor(
    public sidebarStore: SidebarStore,
    private assetsStore: AssetsStore,
    private icsTemplatesStore: IcsTemplatesStore,
    private messageStore: MessageStore,
    private formBuilder: FormBuilder,
    private manageAssetsService: ManageAssetsService,
    private fileStore: FilesStore
  ) {}

  ngOnInit(): void {
    /**
     * Subscription
     * Subscribe to the crudMode$
     * Should reset the form when mode equals "create"
     */
    this.assetsStore.crudMode$.subscribe((crudMode) => {
      this.crudMode = crudMode;
    });

    /**
     * Subscription
     * Subscribe to the currentAsset$ to set the form values when the asset is loaded from the backend
     */
    this.assetsStore.currentAsset$.subscribe((asset: Asset) => {
      this.createForm();
      this.setAsset(asset);
      this.setMappedAsset(asset);

      if (this.crudMode === 'edit' || this.crudMode === 'duplicate') {
        this.form.patchValue(this.mappedAsset);
      }

      if (this.crudMode === 'create') {
        this.createForm();
        this.form.reset();
      }
    });

    /**
     * Subscription
     * Subscribe to icsTemplate$ to set the icsTemplate
     */
    this.icsTemplatesStore.currentIcsTemplate$.subscribe((icsTemplate) => {
      if (this.crudMode === 'edit' || this.crudMode === 'duplicate') {
        this.icsTemplate = icsTemplate;
        this.createForm();
        this.setMappedAsset(this.asset);
        this.form.patchValue(this.mappedAsset);
      }
    });

    /**
     * Subscription
     * Subscribe to the currentAssetId$ to set the assetId
     */
    this.assetsStore.currentAssetId$.subscribe(
      (assetId) => (this.assetId = assetId)
    );

    /**
     * Subscription
     * Subscribe to the currentFileIds$ to set the fileIds
     */
    this.fileStore.currentFileIds$.subscribe((fileIds) => {
      this.currentFileIds = fileIds as any;
      // console.log(
      //   'MANAGE ASSET | FILE STORE | currentFileIds',
      //   this.currentFileIds
      // );
    });
  }

  createForm(): void {
    if (!this.icsTemplate) return;
    this.createFormControlsRecursively(this.icsTemplate.metadata.properties);
    this.createFormControlsRecursively(this.icsTemplate.parameters.properties);
    this.form = this.formBuilder.group(this.formControls);
  }

  createFormControlsRecursively(obj: object) {
    let keys = [];
    for (const key in obj) {
      const isField = Object.prototype.hasOwnProperty.call(obj[key], 'id');
      const field = obj[key];
      const validators = [];
      if (isField) {
        keys.push(field as never);
        if (field.required) {
          // TODO: Fix this
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          validators.push(Validators.required);
        }

        if (field.type === 'number') {
          // TODO: Fix this
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          validators.push(Validators.pattern('-?\\d+(?:\\.\\d+)?'));
        }
        if (!field.hidden) {
          this.formControls[field.id] = ['', validators];
        }

        const copiedKeys = [...keys];

        copiedKeys.map((key) => {
          return {
            // TODO: Fix this
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            key: key?.id,
            // TODO: Fix this
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            value: key?.name,
          };
        });
        // TODO: Fix this
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const flattened = copiedKeys.reduce((acc, cur) => {
          return { ...acc, ...(cur as any) };
        }, {});
        // TODO: Fix this
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.mappedMetadata.push(flattened);
      }
      if (typeof field === 'object') {
        keys = keys.concat(this.createFormControlsRecursively(field));
      }
    }
    return keys;
  }

  onSubmit(): void {
    this.currentFileIds = uniqueIdsArray([
      ...this.currentFileIds,
      ...((this.asset.metadata as any)?.fileIds || []),
    ]);

    console.log('MANAGE ASSET | onSubmit', this.currentFileIds);

    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.value;
      const templateName = this.selectedIcsTemplateDescription?.name;
      const templateId = this.selectedIcsTemplateDescription?.id;
      const objectKeys = Object.keys(formValue);
      const objectKeysMapped = {};
      objectKeys.map((key) => {
        objectKeysMapped[key] = {
          value: formValue[key],
          name:
            // TODO: Fix this
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.mappedMetadata.filter((item) => item.id === key)[0].name ||
            'Name is missing',
        };
      });

      if (this.crudMode === 'create' || this.crudMode === 'duplicate') {
        const template = {
          templateCategory: {
            value: templateName,
            name: 'Template Category',
          },
          templateId: {
            value: templateId,
            name: 'Template Id',
          },
        };
        let metadata = {
          ...objectKeysMapped,
          fileIds: this.currentFileIds,
          creationDate: {
            value: new Date(),
            name: 'Creation date',
          },
          status: {
            value: 'Incomplete',
            name: 'Status',
          },
          manageGridAssetActions: {
            value: false,
            name: 'Actions',
          },
        };
        if (this.crudMode === 'create') {
          metadata = {
            ...metadata,
            ...template,
          };
        }
        if (this.crudMode === 'duplicate') {
          metadata = {
            ...metadata,
            ...(this.asset?.metadata as object),
            ...objectKeysMapped,
            creationDate: {
              value: new Date(),
              name: 'Creation date',
            },
          };
        }

        // Create asset
        this.manageAssetsService
          .createAsset({
            metadata,
            parameters: [],
          })
          .subscribe({
            complete: () => {
              this.fileStore.setcurrentFileIds(null);
              this.sidebarStore.store = { isOpen: false, id: 'MANAGE_ASSETS' };
              this.sidebarStore.store = {
                isOpen: false,
                id: 'SELECT_ICS_TEMPLATES',
              };
              this.messageStore.setMessage({
                severity: 'success',
                detail: `${
                  objectKeysMapped?.[
                    'base-objects-v0.1-machine-identification-alias'
                  ]?.value || 'Asset'
                } created!`,
              });
              this.assetsStore.getAssetList();
              this.isLoading = false;
              this.form.reset();
            },
            error: (error) => {
              throw new Error(error);
            },
          });
      } else {
        const updatedMetadata = {
          ...(this.asset?.metadata as object),
          ...objectKeysMapped,
          fileIds: this.currentFileIds,
          editDate: {
            value: new Date(),
            name: 'Edit date',
          },
        };

        // Edit or duplicate asset
        this.manageAssetsService
          .updateAssetById(this.assetId || 'MISSING', {
            metadata: updatedMetadata,
            parameters: [],
          })
          .subscribe({
            complete: () => {
              this.fileStore.setcurrentFileIds(null);
              this.sidebarStore.store = { isOpen: false, id: 'MANAGE_ASSETS' };
              this.sidebarStore.store = {
                isOpen: false,
                id: 'SELECT_ICS_TEMPLATES',
              };
              this.messageStore.setMessage({
                severity: 'success',
                detail: `${
                  objectKeysMapped?.[
                    'base-objects-v0.1-machine-identification-alias'
                  ]?.value || 'Asset'
                } edited!`,
              });
              this.assetsStore.getAssetList();
              this.isLoading = false;
              this.form.reset();
            },
            error: (error) => {
              throw new Error(error);
            },
          });
      }
    } else {
      throw new Error('Form is invalid');
    }
  }

  setMappedAsset(asset): void {
    const mappedAsset = {};
    for (const key in this.form.value) {
      mappedAsset[key] = asset?.metadata?.[key]?.value;
    }
    this.mappedAsset = mappedAsset;
  }

  setAsset(asset): void {
    this.asset = asset;
  }
}
