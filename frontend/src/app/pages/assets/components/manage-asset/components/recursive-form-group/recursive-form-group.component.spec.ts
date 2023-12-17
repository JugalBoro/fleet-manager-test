import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursiveFormGroupComponent } from './recursive-form-group.component';

describe('RecursiveFormGroupComponent', () => {
  let component: RecursiveFormGroupComponent;
  let fixture: ComponentFixture<RecursiveFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecursiveFormGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecursiveFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
