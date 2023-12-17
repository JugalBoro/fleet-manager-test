import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { NavigateBackButtonDirective } from './navigate-back.directive';
import { NavigateBackComponent } from './navigate-back.component';

@NgModule({
  declarations: [NavigateBackComponent, NavigateBackButtonDirective],
  imports: [CommonModule, ButtonModule],
  exports: [NavigateBackComponent, NavigateBackButtonDirective],
})
export class NavigateBackModule {}
