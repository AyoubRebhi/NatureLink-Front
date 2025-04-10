import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilityListComponent } from './disponibility-list.component';

describe('DisponibilityListComponent', () => {
  let component: DisponibilityListComponent;
  let fixture: ComponentFixture<DisponibilityListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisponibilityListComponent]
    });
    fixture = TestBed.createComponent(DisponibilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
