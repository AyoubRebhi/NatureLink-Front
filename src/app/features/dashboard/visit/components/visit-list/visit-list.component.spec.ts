import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitListComponent } from './visit-list.component';

describe('VisitListComponent', () => {
  let component: VisitListComponent;
  let fixture: ComponentFixture<VisitListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitListComponent]
    });
    fixture = TestBed.createComponent(VisitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
