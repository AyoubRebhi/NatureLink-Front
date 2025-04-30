import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFoodClothingfrontComponent } from './list-food-clothingfront.component';

describe('ListFoodClothingfrontComponent', () => {
  let component: ListFoodClothingfrontComponent;
  let fixture: ComponentFixture<ListFoodClothingfrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListFoodClothingfrontComponent]
    });
    fixture = TestBed.createComponent(ListFoodClothingfrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
