import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMComponent } from './event-m.component';

describe('EventMComponent', () => {
  let component: EventMComponent;
  let fixture: ComponentFixture<EventMComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventMComponent]
    });
    fixture = TestBed.createComponent(EventMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
