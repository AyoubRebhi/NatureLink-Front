import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementDetailComponent } from './logement-detail.component';

describe('LogementDetailComponent', () => {
  let component: LogementDetailComponent;
  let fixture: ComponentFixture<LogementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementDetailComponent]
    });
    fixture = TestBed.createComponent(LogementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
