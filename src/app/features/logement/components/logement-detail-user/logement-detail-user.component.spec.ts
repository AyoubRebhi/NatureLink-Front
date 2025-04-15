import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementDetailUserComponent } from './logement-detail-user.component';

describe('LogementDetailUserComponent', () => {
  let component: LogementDetailUserComponent;
  let fixture: ComponentFixture<LogementDetailUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementDetailUserComponent]
    });
    fixture = TestBed.createComponent(LogementDetailUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
