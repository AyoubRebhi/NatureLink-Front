import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClothingComponent } from './add-clothing.component';

describe('AddClothingComponent', () => {
  let component: AddClothingComponent;
  let fixture: ComponentFixture<AddClothingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddClothingComponent]
    });
    fixture = TestBed.createComponent(AddClothingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
