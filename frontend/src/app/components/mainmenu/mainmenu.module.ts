import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainmenuComponent } from './mainmenu.component';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [MainmenuComponent],
  imports: [CommonModule, RouterLink],
  exports: [MainmenuComponent],
})
export class MainmenuModule {}
