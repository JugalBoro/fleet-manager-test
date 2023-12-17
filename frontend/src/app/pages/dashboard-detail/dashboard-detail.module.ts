import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDetailComponent } from './dashboard-detail.component';
import { DashboardDetailRoutingModule } from './dashboard-detail-routing.module';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from './chart/chart.component';
import { GridComponent } from '../../components/data-grid/grid.component';
import { NavigateBackModule } from '../../components/navigate-back/navigate-back.module';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [DashboardDetailComponent],
  imports: [
    CommonModule,
    ChartComponent,
    DashboardDetailRoutingModule,
    CardModule,
    ButtonModule,
    MultiSelectModule,
    DropdownModule,
    FormsModule,
    GridComponent,
    NavigateBackModule,
    TabViewModule,
    BadgeModule,
    SelectButtonModule,
    ProgressSpinnerModule,
  ],
  exports: [DashboardDetailComponent],
})
export class DashboardDetailModule {}
