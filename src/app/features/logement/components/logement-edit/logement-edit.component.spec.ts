import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementEditComponent } from './logement-edit.component';

describe('LogementEditComponent', () => {
  let component: LogementEditComponent;
  let fixture: ComponentFixture<LogementEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementEditComponent]
    });
    fixture = TestBed.createComponent(LogementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
