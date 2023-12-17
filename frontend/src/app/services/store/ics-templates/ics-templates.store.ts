import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IcsField } from '../../../model/ics-field';
import {
  IcsTemplateDescription,
  IcsTemplateDto,
} from '../../../model/ics-template';
import { FetchIcsTemplatesService } from '../../api/fetch-ics-templates/fetch-ics-templates.service';

@Injectable({
  providedIn: 'root',
})
export class IcsTemplatesStore {
  public icsTemplateDescription$: Subject<IcsTemplateDescription[]> =
    new Subject();
  public currentIcsTemplateDescription$: Subject<IcsTemplateDescription> =
    new Subject();
  public currentIcsTemplate$: BehaviorSubject<IcsTemplateDto> =
    new BehaviorSubject({
      template: {
        title: '',
        description: '',
      },
      metadata: {
        title: '',
        description: '',
        properties: [] as IcsField[],
      },
      parameters: {
        title: '',
        description: '',
        properties: [] as IcsField[],
      },
    });

  constructor(private fetchIcsTemplatesService: FetchIcsTemplatesService) {}

  public getIcsTemplateDescriptionList(): void {
    this.fetchIcsTemplatesService
      .fetchIcsTemplateDescriptions()
      .subscribe((descriptions: IcsTemplateDescription[]) => {
        this.icsTemplateDescription$.next(descriptions);
      });
  }

  public getIcsTemplateById(id: string): void {
    this.fetchIcsTemplatesService
      .fetchIcsTemplates(id)
      .subscribe((template: IcsTemplateDto) => {
        this.currentIcsTemplate$.next(template);
      });
  }
}
