import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementCreateUserComponent } from './logement-create-user.component';

describe('LogementCreateUserComponent', () => {
  let component: LogementCreateUserComponent;
  let fixture: ComponentFixture<LogementCreateUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementCreateUserComponent]
    });
    fixture = TestBed.createComponent(LogementCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
