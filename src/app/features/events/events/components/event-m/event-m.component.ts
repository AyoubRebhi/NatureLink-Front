import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventServiceService } from 'src/app/core/services/event-service.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FilterByTitlePipe } from 'src/app/shared01/pipes/filter-by-title.pipe';
import { jsPDF } from 'jspdf';//Ajouter
import * as XLSX from 'xlsx';//Ajouter
import * as FileSaver from 'file-saver';//Ajouter


@Component({
  selector: 'app-event-m',
  templateUrl: './event-m.component.html',
  styleUrls: ['./event-m.component.scss'],
})
export class EventMComponent implements OnInit {
  events: any[] = [];
  searchQuery: string = '';
  tabs = this.generateDateTabs(5);
  selectedTab = this.tabs[0];
  currentIndex: number = 0;
  noEventsForSelectedDate: boolean = false;


  isAdminView = false;
  userInput: string = '';
  showUserInputPopup: boolean = false;
  recommendedEvents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventservice: EventServiceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.isAdminView = data['adminView'] || false;
    });
    this.getAllEvents();
    this.updateFilteredEvents();
    this.openUserInputPopup();
    setInterval(() => this.next(), 3000);
  }

  openUserInputPopup() {
    this.showUserInputPopup = true;
  }

  closeUserInputPopup() {
    this.showUserInputPopup = false;
  }

  //changer ce methode
  submitRecommendation() {
    if (!this.userInput.trim()) {
      alert("Veuillez entrer un centre d'intérêt.");
      return;
    }
  
    this.eventservice.recommendEvents(this.userInput, this.events).subscribe(
      (res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        this.recommendedEvents = res
  .sort((a: any, b: any) => b.similarity - a.similarity)
  .filter((event: any) => {
    if (!event.date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight

    // Clean up spacing
    const dateParts = event.date.trim().split(' to ').map((s: string) => s.trim());

    // Parse start and end dates
    const startDate = new Date(dateParts[0]);
    startDate.setHours(0, 0, 0, 0);

    let endDate = startDate;
    if (dateParts.length > 1 && dateParts[1]) {
      endDate = new Date(dateParts[1]);
      endDate.setHours(0, 0, 0, 0);
    }

    const isUpcoming = endDate >= today;
    console.log(`Event: ${event.title}, Start: ${startDate}, End: ${endDate}, Upcoming: ${isUpcoming}`);
    return isUpcoming;
  })
  .slice(0, 3);
        this.closeUserInputPopup();
        console.log('Top 3 recommended events:', this.recommendedEvents);
      },
      (err) => {
        console.error('Erreur de recommandation :', err);
        alert('Échec de la recommandation.');
      }
    );
  }

  private generateDateTabs(count: number): { label: string, date: string }[] {
    const tabs = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      tabs.push({
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        date: date.toISOString().split('T')[0]
      });
    }

    return tabs;
  }

  getAllEvents() {
    this.eventservice.getAllEvents().subscribe((res) => {
      this.events = res;
    });
  }

  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventservice.deleteEvent(id).subscribe(() => {
        this.events = this.events.filter(event => event.id !== id);
        alert('Event deleted successfully!');
      }, error => {
        console.error('Delete failed:', error);
        alert('Failed to delete the event.');
      });
    }
  }

  bookEvent(eventId: number): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }
    this.router.navigate(['/reservation/create'], {
      queryParams: { type: 'EVENT', id: eventId }
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
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
    this.noEventsForSelectedDate = this.filteredEvents.length === 0;

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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize
    
    const filteredEvents = (this.filteredEvents.length ? this.filteredEvents : this.events).filter(event => {
      if (!event.date) return false;
      const [startStr, endStr] = event.date.split(' to ');
      const startDate = new Date(startStr);
      const endDate = new Date(endStr || startStr);
    
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
    
      return endDate >= today;
    });
    
    const eventsToExport =  filteredEvents;

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

        if (event.image) {
          let imgData = event.image;
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

        const lines = [
          `Event ${i + 1}`,
          `Title: ${event.title || 'N/A'}`,
          `Date: ${event.date || 'N/A'}`,
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
  customDate: string = '';

  goToCustomDate() {
    if (!this.customDate) return;
  
    const alreadyExists = this.tabs.some(tab => tab.date === this.customDate);
    const label = new Date(this.customDate).toLocaleDateString('fr-FR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  
    if (!alreadyExists) {
      this.tabs.push({
        label: label,
        date: this.customDate,
      });
    }
  
    this.selectedTab = this.tabs.find(tab => tab.date === this.customDate)!;
  }
  
  exportToExcel(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const filteredEvents = (this.filteredEvents.length ? this.filteredEvents : this.events).filter(event => {
      if (!event.date) return false;
      const [startStr, endStr] = event.date.split(' to ');
      const startDate = new Date(startStr);
      const endDate = new Date(endStr || startStr);
  
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
  
      return endDate >= today;
    });
  
    const exportData = filteredEvents.map(event => ({
      Title: event.title,
      Date: event.date,
      Location: event.location,
      Description: event.description,
      Founder: event.founder
    }));
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Events': worksheet }, SheetNames: ['Events'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'events.xlsx');
  }
  
}