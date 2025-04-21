import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackListFComponent } from './pack-list-f.component';

describe('PackListFComponent', () => {
  let component: PackListFComponent;
  let fixture: ComponentFixture<PackListFComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackListFComponent]
    });
    fixture = TestBed.createComponent(PackListFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
