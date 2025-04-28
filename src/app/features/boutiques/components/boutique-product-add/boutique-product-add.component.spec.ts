import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueProductAddComponent } from './boutique-product-add.component';

describe('BoutiqueProductAddComponent', () => {
  let component: BoutiqueProductAddComponent;
  let fixture: ComponentFixture<BoutiqueProductAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoutiqueProductAddComponent]
    });
    fixture = TestBed.createComponent(BoutiqueProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
