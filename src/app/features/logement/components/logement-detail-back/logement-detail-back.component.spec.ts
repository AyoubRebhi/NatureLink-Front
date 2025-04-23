import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementDetailBackComponent } from './logement-detail-back.component';

describe('LogementDetailBackComponent', () => {
  let component: LogementDetailBackComponent;
  let fixture: ComponentFixture<LogementDetailBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementDetailBackComponent]
    });
    fixture = TestBed.createComponent(LogementDetailBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
