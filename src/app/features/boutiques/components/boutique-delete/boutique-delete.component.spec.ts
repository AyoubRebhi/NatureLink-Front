import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueDeleteComponent } from './boutique-delete.component';

describe('BoutiqueDeleteComponent', () => {
  let component: BoutiqueDeleteComponent;
  let fixture: ComponentFixture<BoutiqueDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoutiqueDeleteComponent]
    });
    fixture = TestBed.createComponent(BoutiqueDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
