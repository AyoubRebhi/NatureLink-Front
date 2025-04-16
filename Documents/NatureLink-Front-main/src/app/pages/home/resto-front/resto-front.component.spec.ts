import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoFrontComponent } from './resto-front.component';

describe('RestoFrontComponent', () => {
  let component: RestoFrontComponent;
  let fixture: ComponentFixture<RestoFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestoFrontComponent]
    });
    fixture = TestBed.createComponent(RestoFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
