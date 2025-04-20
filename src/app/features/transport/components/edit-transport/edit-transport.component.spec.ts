import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTransportComponent } from './edit-transport.component';

describe('EditTransportComponent', () => {
  let component: EditTransportComponent;
  let fixture: ComponentFixture<EditTransportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTransportComponent]
    });
    fixture = TestBed.createComponent(EditTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
