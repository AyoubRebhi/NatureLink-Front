import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Visit } from 'src/app/core/models/visit';
import { VisitService } from 'src/app/core/services/visit.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss'],
  providers: [DatePipe]
})
export class VisitListComponent implements OnInit {
  visits: Visit[] = [];
  searchTerm: string = '';
  error: string = '';
  isLoading = true;

  constructor(
    private visitService: VisitService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadVisits();
  }
  loadVisits(): void {
    this.isLoading = true;
    this.visitService.getAllVisits().subscribe({
      next: (data) => {
        this.visits = data.map(v => ({
          ...v,
          // Si l'objet 'monument' n'est pas fourni, on utilise la valeur de 'nomMonument'
          monument: v.monument ? v.monument : { id: 0, nom: v.nomMonument || '-' },
          // Si l'objet 'guide' n'est pas fourni, on utilise la valeur de 'nomGuide'
          guide: v.guide
            ? v.guide
            : (() => {
                if (v.nomGuide) {
                  const parts = v.nomGuide.split(' ');
                  return { id: 0, firstName: parts[0] || '-', lastName: parts.slice(1).join(' ') || '-' };
                }
                return { id: 0, firstName: '-', lastName: '-' };
              })()
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }


  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || date;
  }

  get filteredVisits(): Visit[] {
    if (!this.searchTerm) return this.visits;

    const term = this.searchTerm.toLowerCase();
    return this.visits.filter(visit => {
      const monumentName = (visit.monument?.nom || '').toLowerCase();
      const guideName = `${visit.guide?.firstName || ''} ${visit.guide?.lastName || ''}`.toLowerCase().trim();

      return monumentName.includes(term) || guideName.includes(term);
    });
  }

  updateVisit(id: number): void {
    this.router.navigate(['/admin/dashboard/visit', id]);
  }

 
  deleteVisit(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette visite ?')) {
      this.visitService.deleteVisit(id).subscribe({
        next: () => {
          // Mise à jour locale de la liste après suppression
          this.visits = this.visits.filter(v => v.id !== id);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.error = err.error?.message || 'Erreur lors de la suppression';
        }
      });
    }
  }
}
