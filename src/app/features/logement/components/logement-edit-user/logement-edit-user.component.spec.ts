import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementEditUserComponent } from './logement-edit-user.component';

describe('LogementEditUserComponent', () => {
  let component: LogementEditUserComponent;
  let fixture: ComponentFixture<LogementEditUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementEditUserComponent]
    });
    fixture = TestBed.createComponent(LogementEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
