import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementAddComponent } from './equipement-add.component';

describe('EquipementAddComponent', () => {
  let component: EquipementAddComponent;
  let fixture: ComponentFixture<EquipementAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipementAddComponent]
    });
    fixture = TestBed.createComponent(EquipementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
