import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDComponent } from './event-d.component';

describe('EventDComponent', () => {
  let component: EventDComponent;
  let fixture: ComponentFixture<EventDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventDComponent]
    });
    fixture = TestBed.createComponent(EventDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
