import { Component,OnInit } from '@angular/core';
import { EventServiceService } from 'src/app/event-service.service';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Event } from 'src/app/core/models/event.module';
@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.scss']
})
export class EventAddComponent implements OnInit {
  
  eventForm!: FormGroup;
  selectedImage: File | null = null;
  base64Image: string = '';
  newEvent: Event = {
    nbrplace: '0',
    date: '',
    description: '',
    location: '',
    founder:'',
    title: '',
    image:''
  };
  constructor(private fb:FormBuilder,private eventservice:EventServiceService ){
    
  }

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
      participants: [2, [Validators.required, Validators.min(1)]],
      founder: ['', Validators.required],

    });
}
onSubmit(): void {
  if (this.eventForm.valid) {
    // Populate the Event object from the form values
    this.newEvent.title = this.eventForm.value.title;
    this.newEvent.date = `${this.eventForm.value.startDate} to ${this.eventForm.value.endDate}`;
    this.newEvent.location = `${this.eventForm.value.fromLocation} to ${this.eventForm.value.toLocation}`;
    this.newEvent.founder=this.eventForm.value.founder;
    this.newEvent.nbrplace=this.eventForm.value.participants;
    this.newEvent.description=this.eventForm.value.description;
    this.newEvent.image = this.base64Image;
    console.log('Form submitted:', this.eventForm.value);
    console.log('Event object:', this.newEvent);

    // Call the service to save the event
    this.eventservice.postEvent(this.newEvent).subscribe(response => {
      console.log('Event added:', response);
    });
  } else {
    // Mark all fields as touched to trigger validation
    this.eventForm.markAllAsTouched();
  }
}
handleUpload(event: any) {
  const file = event.target.files[0];
  this.selectedImage = file;

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      this.base64Image = reader.result as string; // Store the base64 string
      console.log("Base64 Image:", this.base64Image);
    };

    reader.readAsDataURL(file); // Convert file to base64
  }
}



}
