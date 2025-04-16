import { Component, OnInit } from '@angular/core';
import { Visit } from 'src/app/core/models/visit';
import { VisitService } from 'src/app/core/services/visit.service';

@Component({
  selector: 'app-visit-front',
  templateUrl: './visit-front.component.html',
  styleUrls: ['./visit-front.component.scss']
})
export class VisitFrontComponent implements OnInit {
  visits: Visit[] = [];
  filteredVisits: Visit[] = [];
  searchTerm: string = '';
  isLoading = true;
  error: string = '';

  constructor(private visitService: VisitService) {}

  ngOnInit(): void {
    this.loadVisits();
  }

  loadVisits(): void {
    this.isLoading = true;
    this.visitService.getAllVisits().subscribe({
      next: (data) => {
        this.visits = data.map(v => ({
          ...v,
          monument: v.monument ? v.monument : { id: 0, nom: v.nomMonument || 'Inconnu' },
          guide: v.guide
            ? v.guide
            : (() => {
                if (v.nomGuide) {
                  const parts = v.nomGuide.split(' ');
                  return {
                    id: 0,
                    firstName: parts[0] || '-',
                    lastName: parts.slice(1).join(' ') || '-'
                  };
                }
                return { id: 0, firstName: '-', lastName: '-' };
              })()
        }));

        this.filteredVisits = this.visits; // Initialisation
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors du chargement';
        this.isLoading = false;
      }
    });
  }

  filterVisits(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredVisits = this.visits.filter(visit => {
      const monumentName = (visit.monument?.nom || '').toLowerCase();
      const guideName = `${visit.guide?.firstName || ''} ${visit.guide?.lastName || ''}`.toLowerCase().trim();
      return monumentName.includes(term) || guideName.includes(term);
    });
  }
}
