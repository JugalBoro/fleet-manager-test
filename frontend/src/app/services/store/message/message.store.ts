import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageStore {
  public message$: Subject<{
    severity: string;
    summary: string;
    detail: string;
  }> = new Subject();

  constructor(private messageService: MessageService) {}

  setMessage({ severity, detail }: { severity: string; detail: string }) {
    this.message$.next({ severity, summary: severity, detail });
  }

  getMessage(): void {
    this.message$.subscribe((message) => {
      this.messageService.add(message);
    });
  }
}
