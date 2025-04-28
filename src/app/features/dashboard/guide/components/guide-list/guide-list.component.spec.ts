import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideListComponent } from './guide-list.component';

describe('GuideListComponent', () => {
  let component: GuideListComponent;
  let fixture: ComponentFixture<GuideListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuideListComponent]
    });
    fixture = TestBed.createComponent(GuideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
