import { Component,OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
@Component({
  selector: 'eventform',
  templateUrl: './eevntform.component.html',
  styleUrls: ['./eevntform.component.scss']
})
export class EevntformComponent implements OnInit {
  eventForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}
 
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      participants: [2, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      console.log('Form submitted:', this.eventForm.value);
      // Here you would typically send the data to your backend
    } else {
      this.eventForm.markAllAsTouched();
    }
  }
}
