import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTransportComponent } from './list-transport.component';

describe('ListTransportComponent', () => {
  let component: ListTransportComponent;
  let fixture: ComponentFixture<ListTransportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTransportComponent]
    });
    fixture = TestBed.createComponent(ListTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
