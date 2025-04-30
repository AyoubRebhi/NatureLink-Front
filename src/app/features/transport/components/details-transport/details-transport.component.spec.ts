import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTransportComponent } from './details-transport.component';

describe('DetailsTransportComponent', () => {
  let component: DetailsTransportComponent;
  let fixture: ComponentFixture<DetailsTransportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsTransportComponent]
    });
    fixture = TestBed.createComponent(DetailsTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
