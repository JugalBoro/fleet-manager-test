import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigateBackComponent } from './navigate-back.component';

describe('NavigateBackComponent', () => {
  let component: NavigateBackComponent;
  let fixture: ComponentFixture<NavigateBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigateBackComponent],
    });
    fixture = TestBed.createComponent(NavigateBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
