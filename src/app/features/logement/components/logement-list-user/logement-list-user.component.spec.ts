import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementListUserComponent } from './logement-list-user.component';

describe('LogementListUserComponent', () => {
  let component: LogementListUserComponent;
  let fixture: ComponentFixture<LogementListUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementListUserComponent]
    });
    fixture = TestBed.createComponent(LogementListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
