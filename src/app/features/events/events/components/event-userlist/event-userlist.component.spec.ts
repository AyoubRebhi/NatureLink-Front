import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventUserlistComponent } from './event-userlist.component';

describe('EventUserlistComponent', () => {
  let component: EventUserlistComponent;
  let fixture: ComponentFixture<EventUserlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventUserlistComponent]
    });
    fixture = TestBed.createComponent(EventUserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
