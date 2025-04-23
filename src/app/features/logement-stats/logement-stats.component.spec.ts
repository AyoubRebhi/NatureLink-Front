import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogementStatsComponent } from './logement-stats.component';

describe('LogementStatsComponent', () => {
  let component: LogementStatsComponent;
  let fixture: ComponentFixture<LogementStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogementStatsComponent]
    });
    fixture = TestBed.createComponent(LogementStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
