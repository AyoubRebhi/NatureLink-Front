import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentFrontComponent } from './monument-front.component';

describe('MonumentFrontComponent', () => {
  let component: MonumentFrontComponent;
  let fixture: ComponentFixture<MonumentFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonumentFrontComponent]
    });
    fixture = TestBed.createComponent(MonumentFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
