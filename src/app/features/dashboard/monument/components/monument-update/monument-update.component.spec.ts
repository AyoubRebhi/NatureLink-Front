import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentUpdateComponent } from './monument-update.component';

describe('MonumentUpdateComponent', () => {
  let component: MonumentUpdateComponent;
  let fixture: ComponentFixture<MonumentUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonumentUpdateComponent]
    });
    fixture = TestBed.createComponent(MonumentUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
