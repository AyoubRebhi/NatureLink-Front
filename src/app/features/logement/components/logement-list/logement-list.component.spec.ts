import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementListComponent } from './logement-list.component';

describe('LogementListComponent', () => {
  let component: LogementListComponent;
  let fixture: ComponentFixture<LogementListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementListComponent]
    });
    fixture = TestBed.createComponent(LogementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
