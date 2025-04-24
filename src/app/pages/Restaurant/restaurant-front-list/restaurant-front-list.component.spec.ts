import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantFrontListComponent } from './restaurant-front-list.component';

describe('RestaurantFrontListComponent', () => {
  let component: RestaurantFrontListComponent;
  let fixture: ComponentFixture<RestaurantFrontListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantFrontListComponent]
    });
    fixture = TestBed.createComponent(RestaurantFrontListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
