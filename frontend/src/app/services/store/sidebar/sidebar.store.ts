import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

type Store = { isOpen: boolean; id: string };

@Injectable({
  providedIn: 'root',
})
export class SidebarStore {
  private storeArray: Store[] = [];
  public getStore$: Subject<Store[]> = new Subject();

  set store({ isOpen, id }: Store) {
    const filteredById = this.storeArray.filter((item) => item?.id === id);

    const hasSameState = filteredById[0]?.isOpen === isOpen;
    const hasId = filteredById.length > 0;

    if (hasId && !hasSameState) {
      this.storeArray = this.storeArray.filter((item) => item?.id !== id);
      this.storeArray = [...this.storeArray, { isOpen, id }];
    }

    if (!hasId && !hasSameState) {
      this.storeArray = [...this.storeArray, { isOpen, id }];
    }

    this.getStore$.next(this.storeArray);
  }
}
