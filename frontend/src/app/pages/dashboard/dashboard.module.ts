import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from './chart/chart.component';
import { GridComponent } from '../../components/data-grid/grid.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ChartComponent,
    DashboardRoutingModule,
    CardModule,
    MultiSelectModule,
    DropdownModule,
    FormsModule,
    GridComponent,
    ProgressSpinnerModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
