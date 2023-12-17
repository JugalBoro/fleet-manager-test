import { Component, Input } from '@angular/core';
import { IcsTemplateDescription } from './../../../../model/ics-template';

@Component({
  selector: 'infus-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css'],
})
export class AddAssetComponent {
  @Input() icsTemplates: IcsTemplateDescription[] | null = [];
}
