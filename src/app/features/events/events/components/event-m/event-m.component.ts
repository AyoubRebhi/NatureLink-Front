import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventServiceService } from 'src/app/core/services/event-service.service';

import { FilterByTitlePipe } from 'src/app/shared01/pipes/filter-by-title.pipe';
import { jsPDF } from 'jspdf';
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
  currentIndex: number = 0;

  isAdminView = false;
  userInput: string = '';
  showUserInputPopup: boolean = false;
  recommendedEvents: any[] = [];
  
  openUserInputPopup() {
    this.showUserInputPopup = true;
  }
  
  closeUserInputPopup() {
    this.showUserInputPopup = false;
  }
  
  submitRecommendation() {
    if (!this.userInput.trim()) {
      alert("Veuillez entrer un centre d'intérêt.");
      return;
    }
  
    this.eventservice.recommendEvents(this.userInput, this.events).subscribe(
      (res) => {
        // Trier par similarité décroissante, puis garder les 3 premiers
        this.recommendedEvents = res
          .sort((a: any, b: any) => b.similarity - a.similarity)
          .slice(0, 3);
  
        this.closeUserInputPopup();
        console.log('Top 3 recommended events:', this.recommendedEvents);
      },
      (err) => {
        console.error('Erreur de recommandation :', err);
        alert('Échec de la recommandation.');
      }
    );
  
    console.log('this.userInput:', this.userInput);
  }
  
  
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
    this.openUserInputPopup();
    setInterval(() => this.next(), 3000);

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

downloadPDF() {
  this.eventservice.downloadEventsPDF().subscribe(blob => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'events.pdf';
    link.click();
  }, error => {
    console.error('PDF download failed', error);
  });
}
generatePDF() {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const eventsToExport = this.filteredEvents.length ? this.filteredEvents : this.events;

  // PDF Title
  doc.setFontSize(18);
  const title = 'Event List';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, y);
  y += 15;

  const loadImage = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg');
        resolve(base64);
      };
      img.onerror = (err) => reject(err);
    });
  };

  const addEventToPDF = async () => {
    for (let i = 0; i < eventsToExport.length; i++) {
      const event = eventsToExport[i];
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      // Add Image (resize to fit)
      if (event.image) {
        let imgData = event.image;

        // If it's a URL, convert to base64
        if (!imgData.startsWith('data:image')) {
          try {
            imgData = await loadImage(event.image);
          } catch (e) {
            console.error('Failed to load image', e);
          }
        }

        doc.addImage(imgData, 'JPEG', (pageWidth - 60) / 2, y, 60, 40);
        y += 50;
      }

      // Centered Text
      const lines = [
        `Event ${i + 1}`,
        `Title: ${event.title || 'N/A'}`,
        `Date: ${event.date || 'N/A'} `,
        `Location: ${event.location || 'N/A'}`,
        `Description: ${event.description || 'N/A'}`
      ];

      doc.setFontSize(12);
      lines.forEach(line => {
        const textWidth = doc.getTextWidth(line);
        doc.text(line, (pageWidth - textWidth) / 2, y);
        y += 7;
      });

      y += 10;
    }

    doc.save('events-with-images.pdf');
  };

  addEventToPDF();
}

next() {
  this.currentIndex = (this.currentIndex + 1) % this.events.length;
}

prev() {
  this.currentIndex = (this.currentIndex - 1 + this.events.length) % this.events.length;
}
}
