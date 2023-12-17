import { Directive, HostListener } from '@angular/core';
import { NavigateBackService } from './navigate-back.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[backButton]',
})
export class NavigateBackButtonDirective {
  constructor(private navigateBackService: NavigateBackService) {}

  @HostListener('click')
  onClick(): void {
    this.navigateBackService.back();
  }
}
