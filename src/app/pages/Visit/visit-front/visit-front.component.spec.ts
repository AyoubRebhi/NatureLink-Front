import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitFrontComponent } from './visit-front.component';

describe('VisitFrontComponent', () => {
  let component: VisitFrontComponent;
  let fixture: ComponentFixture<VisitFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitFrontComponent]
    });
    fixture = TestBed.createComponent(VisitFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
