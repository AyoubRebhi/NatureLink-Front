import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementListComponent } from './equipement-list.component';

describe('EquipementListComponent', () => {
  let component: EquipementListComponent;
  let fixture: ComponentFixture<EquipementListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipementListComponent]
    });
    fixture = TestBed.createComponent(EquipementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
