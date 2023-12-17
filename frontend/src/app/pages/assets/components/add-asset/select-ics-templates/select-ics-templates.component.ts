import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Measurement } from '../../../../../model/parameters/measurement';
import { IcsTemplateDescription } from './../../../../../model/ics-template';
import { SidebarStore } from '../../../../../services/store/sidebar/sidebar.store';
import { IcsTemplatesStore } from '../../../../../services/store/ics-templates/ics-templates.store';

@Component({
  selector: 'infus-select-ics-templates',
  templateUrl: './select-ics-templates.component.html',
  styleUrls: ['./select-ics-templates.component.css'],
})
export class SelectIcsTemplatesComponent implements OnChanges {
  sidebarVisible = false;
  @Input() icsTemplates: IcsTemplateDescription[] | null = [];
  icsTemplateGroups: string[] = [];
  parameters$: Observable<{ measurements: Measurement[] }> | null = null;

  constructor(
    public icsTemplatesStore: IcsTemplatesStore,
    public sidebarStore: SidebarStore
  ) {}

  ngOnChanges(): void {
    this.icsTemplateGroups = this.getUniqueValuesFromArray(this.icsTemplates);
  }

  handleClick(icsTemplate: IcsTemplateDescription): void {
    this.sidebarStore.store = { isOpen: true, id: 'MANAGE_ASSETS' };
    this.icsTemplatesStore.currentIcsTemplateDescription$.next(icsTemplate);
  }
  getUniqueValuesFromArray(
    icsTemplates: IcsTemplateDescription[] | null
  ): string[] {
    if (icsTemplates === null) return [];
    const uniqueValues = icsTemplates
      .map((icsTemplate) => icsTemplate.group)
      .filter((value, index, self) => self.indexOf(value) === index);
    return uniqueValues;
  }

  getIcsTemplatesFilteredByGroup(group: string): IcsTemplateDescription[] {
    if (this.icsTemplates === null) return [];
    return this.icsTemplates.filter(
      (icsTemplate) => icsTemplate.group === group
    );
  }
}
