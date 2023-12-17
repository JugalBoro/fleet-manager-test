import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './../../components/data-grid/grid.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';
import { AssetsComponent } from './assets.component';
import { AssetsRoutingModule } from './assets-routing.module';
import { SelectIcsTemplatesComponent } from './components/add-asset/select-ics-templates/select-ics-templates.component';
import { AddAssetComponent } from './components/add-asset/add-asset.component';
import { RippleModule } from 'primeng/ripple';
import { ManageAssetComponent } from './components/manage-asset/manage-asset.component';
import { BadgeModule } from 'primeng/badge';
import { RecursiveFormGroupComponent } from './components/manage-asset/components/recursive-form-group/recursive-form-group.component';

@NgModule({
  declarations: [
    AssetsComponent,
    SelectIcsTemplatesComponent,
    AddAssetComponent,
  ],
  imports: [
    CommonModule,
    GridComponent,
    ManageAssetComponent,
    RecursiveFormGroupComponent,
    BadgeModule,
    CardModule,
    ButtonModule,
    RippleModule,
    SidebarModule,
    AssetsRoutingModule,
    TabViewModule,
  ],
  exports: [AssetsComponent],
})
export class AssetsModule {}
