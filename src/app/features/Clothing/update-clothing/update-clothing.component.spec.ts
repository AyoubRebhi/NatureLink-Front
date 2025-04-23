import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClothingComponent } from './update-clothing.component';

describe('UpdateClothingComponent', () => {
  let component: UpdateClothingComponent;
  let fixture: ComponentFixture<UpdateClothingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateClothingComponent]
    });
    fixture = TestBed.createComponent(UpdateClothingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
