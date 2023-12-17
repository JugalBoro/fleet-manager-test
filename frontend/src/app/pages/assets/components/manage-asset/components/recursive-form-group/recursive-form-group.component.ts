import { CommonModule, NgFor } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IcsTemplateDescription,
  IcsTemplateDto,
} from './../../../../../../model/ics-template';
import { FieldsComponent } from '../../../../../../components/fields/fields.component';

@Component({
  selector: 'infus-recursive-form-group',
  templateUrl: './recursive-form-group.component.html',
  styleUrls: ['./recursive-form-group.component.css'],
  standalone: true,
  imports: [CommonModule, NgFor, ReactiveFormsModule, FieldsComponent],
})
export class RecursiveFormGroupComponent {
  @HostBinding('class') class = 'infus-recursive-form-group';
  @Input()
  public selectedIcsTemplateDescription: IcsTemplateDescription | null = null;
  @Input() public form: FormGroup = {} as FormGroup;
  @Input() public icsTemplate: IcsTemplateDto | null = null;
  @Input() public type: 'identification' | 'parameters' | null = null;
}
