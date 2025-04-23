import { Component, HostListener  } from '@angular/core';

@Component({
  selector: 'app-event-d',
  templateUrl: './event-d.component.html',
  styleUrls: ['./event-d.component.scss']
})
export class EventDComponent {
showScrollButton = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 300; 
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  constructor() {
    document.body.classList.add('event-detail-page');
  }
  organizers = [
    { name: 'Brenden Legros', role: 'Event Coordinator', image: 'assets/img/team-1.jpg' },
    { name: 'Hubert Hirthe', role: 'Speaker Manager', image: 'assets/img/team-2.jpg' },
    { name: 'Cole Emmerich', role: 'Logistics Head', image: 'assets/img/team-3.jpg' }
  ];
  ngOnDestroy() {
    document.body.classList.remove('event-detail-page');
  }
}
