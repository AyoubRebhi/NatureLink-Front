import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitUpdateComponent } from './visit-update.component';

describe('VisitUpdateComponent', () => {
  let component: VisitUpdateComponent;
  let fixture: ComponentFixture<VisitUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitUpdateComponent]
    });
    fixture = TestBed.createComponent(VisitUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
