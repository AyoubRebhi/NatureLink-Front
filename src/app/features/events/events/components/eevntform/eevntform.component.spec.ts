import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EevntformComponent } from './eevntform.component';

describe('EevntformComponent', () => {
  let component: EevntformComponent;
  let fixture: ComponentFixture<EevntformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EevntformComponent]
    });
    fixture = TestBed.createComponent(EevntformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
