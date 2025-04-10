import { Component,OnInit } from '@angular/core';
import { EventServiceService } from 'src/app/event-service.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/core/models/event.module';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.scss']
})
export class EventUpdateComponent implements OnInit {
  eventForm!: FormGroup;

  eventId!: number;
  event: any = {
    id: 0,
    title: '',
    description: '',
    date: '',
    location: '',
    founder: '',
    nbrplace: ''
  };
  constructor(
    private eventService: EventServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder 
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Init form with validators
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      founder: ['', Validators.required],
      description: ['', Validators.required],
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      participants: [1, [Validators.required, Validators.min(1)]]
    });

    // Load event data and populate form
    this.eventService.getEventById(this.eventId).subscribe((eventData:any) => {
      this.eventForm.patchValue({
        title: eventData.title,
        founder: eventData.founder,
        description: eventData.description,
        fromLocation: eventData.location.split(' - ')[0], // assumes format: "From - To"
        toLocation: eventData.location.split(' - ')[1],
        startDate: eventData.date.split(' to ')[0], // assumes format: "2024-05-01 to 2024-05-05"
        endDate: eventData.date.split(' to ')[1],
        participants: +eventData.nbrplace
      });
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;

    const formValues = this.eventForm.value;

    const updatedEvent: any = {
      id: this.eventId,
      title: formValues.title,
      founder: formValues.founder,
      description: formValues.description,
      location: `${formValues.fromLocation} - ${formValues.toLocation}`,
      date: `${formValues.startDate} to ${formValues.endDate}`,
      nbrplace: String(formValues.participants)
    };

    this.eventService.updateEvent(this.eventId, updatedEvent).subscribe(() => {
      this.router.navigate(['/admin/events/management']);
    });
  }
}
