import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectIcsTemplatesComponent } from './select-ics-templates.component';

describe('SelectIcsTemplatesComponent', () => {
  let component: SelectIcsTemplatesComponent;
  let fixture: ComponentFixture<SelectIcsTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectIcsTemplatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectIcsTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
