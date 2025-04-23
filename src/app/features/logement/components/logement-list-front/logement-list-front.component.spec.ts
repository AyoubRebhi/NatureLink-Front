import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementListFrontComponent } from './logement-list-front.component';

describe('LogementListFrontComponent', () => {
  let component: LogementListFrontComponent;
  let fixture: ComponentFixture<LogementListFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementListFrontComponent]
    });
    fixture = TestBed.createComponent(LogementListFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
