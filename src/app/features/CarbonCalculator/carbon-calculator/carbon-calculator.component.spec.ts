import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonCalculatorComponent } from './carbon-calculator.component';

describe('CarbonCalculatorComponent', () => {
  let component: CarbonCalculatorComponent;
  let fixture: ComponentFixture<CarbonCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarbonCalculatorComponent]
    });
    fixture = TestBed.createComponent(CarbonCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
