import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilityAddComponent } from './disponibility-add.component';

describe('DisponibilityAddComponent', () => {
  let component: DisponibilityAddComponent;
  let fixture: ComponentFixture<DisponibilityAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisponibilityAddComponent]
    });
    fixture = TestBed.createComponent(DisponibilityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
