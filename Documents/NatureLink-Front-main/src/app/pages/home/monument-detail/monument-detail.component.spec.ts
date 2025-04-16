import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentDetailComponent } from './monument-detail.component';

describe('MonumentDetailComponent', () => {
  let component: MonumentDetailComponent;
  let fixture: ComponentFixture<MonumentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonumentDetailComponent]
    });
    fixture = TestBed.createComponent(MonumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
