import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideFormComponent } from './guide-form.component';

describe('GuideFormComponent', () => {
  let component: GuideFormComponent;
  let fixture: ComponentFixture<GuideFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuideFormComponent]
    });
    fixture = TestBed.createComponent(GuideFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
