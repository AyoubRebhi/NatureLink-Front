import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentFormComponent } from './monument-form.component';

describe('MonumentFormComponent', () => {
  let component: MonumentFormComponent;
  let fixture: ComponentFixture<MonumentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonumentFormComponent]
    });
    fixture = TestBed.createComponent(MonumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
