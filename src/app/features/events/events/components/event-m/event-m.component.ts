import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventServiceService } from 'src/app/event-service.service';
import { FilterByTitlePipe } from 'src/app/shared/pipes/filter-by-title.pipe';

@Component({
  selector: 'app-event-m',
  templateUrl: './event-m.component.html',
  styleUrls: ['./event-m.component.scss'],
  
})
export class EventMComponent implements OnInit {
  events: any[] = [];
  searchQuery: string = '';  // Store search query
  tabs = this.generateDateTabs(5); 
  selectedTab = this.tabs[0]; // Default to first day

  isAdminView = false;

  constructor(private route: ActivatedRoute, private router: Router, private eventservice: EventServiceService) {}
  private generateDateTabs(count: number): { label: string, date: string }[] {
    const tabs = [];
    const today = new Date();
    
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      tabs.push({
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        date: date.toISOString().split('T')[0] // YYYY-MM-DD format
      });
    }
    
    return tabs;
  }
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.isAdminView = data['adminView'] || false; // Set admin view flag
    });
    this.getAllEvents();
    this.updateFilteredEvents();
  }

  // Fetch all events from the service
  getAllEvents() {
    this.eventservice.getAllEvents().subscribe((res) => {
      this.events = res;  // Assign fetched events to the events array
    });
  }


  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventservice.deleteEvent(id).subscribe(() => {
        this.events = this.events.filter(event => event.id !== id);  // Remove deleted event from the list
        alert('Event deleted successfully!');
      }, error => {
        console.error('Delete failed:', error);
        alert('Failed to delete the event.');
      });
    }
  }
 
  filteredEvents: any[] = [];

updateFilteredEvents() {
  if (!this.searchQuery) {
    this.filteredEvents = this.events;
  } else {
    const query = this.searchQuery.toLowerCase();
    this.filteredEvents = this.events.filter(event => 
      JSON.stringify(event).toLowerCase().includes(query)
    );
  }
}
}
