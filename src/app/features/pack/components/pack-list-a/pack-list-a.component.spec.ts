import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackListAComponent } from './pack-list-a.component';

describe('PackListAComponent', () => {
  let component: PackListAComponent;
  let fixture: ComponentFixture<PackListAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackListAComponent]
    });
    fixture = TestBed.createComponent(PackListAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
