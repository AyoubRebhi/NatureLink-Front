import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementCreateComponent } from './logement-create.component';

describe('LogementCreateComponent', () => {
  let component: LogementCreateComponent;
  let fixture: ComponentFixture<LogementCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementCreateComponent]
    });
    fixture = TestBed.createComponent(LogementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
