import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementCreateFrontComponent } from './logement-create-front.component';

describe('LogementCreateFrontComponent', () => {
  let component: LogementCreateFrontComponent;
  let fixture: ComponentFixture<LogementCreateFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementCreateFrontComponent]
    });
    fixture = TestBed.createComponent(LogementCreateFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
