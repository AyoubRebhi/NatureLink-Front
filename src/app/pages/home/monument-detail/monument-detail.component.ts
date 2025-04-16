import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisitService } from 'src/app/core/services/visit.service';
import { MonumentService } from 'src/app/core/services/monument.service';
import { Visit } from 'src/app/core/models/visit';
import { Monument } from 'src/app/core/models/monument';

@Component({
  selector: 'app-monument-detail',
  templateUrl: './monument-detail.component.html',
  styleUrls: ['./monument-detail.component.scss']
})
export class MonumentDetailComponent implements OnInit {
  monumentId!: number;
  monument!: Monument;
  allVisits: Visit[] = [];
  filteredVisits: Visit[] = [];
  searchTerm: string = '';
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private visitService: VisitService,
    private monumentService: MonumentService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.monumentId = idParam ? +idParam : 0;

    if (this.monumentId) {
      this.loadMonument(); // -> une fois chargé, on appelle loadVisits()
    } else {
      this.error = 'ID de monument invalide.';
      this.isLoading = false;
    }
  }

  loadMonument(): void {
    this.monumentService.getMonumentById(this.monumentId).subscribe({
      next: (data) => {
        this.monument = data;
        this.loadVisits(); // seulement après avoir le nom du monument
      },
      error: () => {
        this.error = 'Erreur lors du chargement du monument.';
        this.isLoading = false;
      }
    });
  }

  loadVisits(): void {
    this.visitService.getAllVisits().subscribe({
      next: (data) => {
        // ⚠️ on filtre par NOM et non plus par ID
        this.allVisits = data.filter(v =>
          v.monument?.nom?.toLowerCase() === this.monument.nom?.toLowerCase()
        );
        this.filteredVisits = [...this.allVisits];
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des visites.';
        this.isLoading = false;
      }
    });
  }

  filterVisits(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredVisits = term
      ? this.allVisits.filter(visit =>
          visit.date?.toString().includes(term) ||
          visit.guide?.firstName?.toLowerCase().includes(term) ||
          visit.guide?.lastName?.toLowerCase().includes(term)
        )
      : [...this.allVisits];
  }

  deleteVisit(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette visite ?')) {
      this.visitService.deleteVisit(id).subscribe({
        next: () => this.loadVisits(),
        error: () => this.error = 'Erreur lors de la suppression de la visite.'
      });
    }
  }
}
