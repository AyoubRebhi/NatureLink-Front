import { Component, OnInit } from '@angular/core';
import { Guide } from 'src/app/core/models/guide';
import { GuideService } from 'src/app/core/services/guide.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guide-list',
  templateUrl: './guide-list.component.html',
  styleUrls: ['./guide-list.component.scss']
})
export class GuideListComponent implements OnInit {

  guides: Guide[] = [];
  isLoading = true;
  searchTerm = '';

  constructor(private guideService: GuideService, private router: Router) {}

  ngOnInit(): void {
    this.loadGuides();
  }

  // Charger les guides depuis l'API
  loadGuides(): void {
    this.isLoading = true;
    this.guideService.getAllGuides().subscribe({
      next: (data) => {
        this.guides = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des guides', error);
        this.isLoading = false;
      }
    });
  }

  // Filtrage selon prénom, nom ou email
  get filteredGuides(): Guide[] {
    return this.guides.filter(guide =>
      guide.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      guide.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      guide.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Redirection vers le formulaire de modification
  update(id: number): void {
    this.router.navigate(['/admin/dashboard/guides/edit', id]);
  }

  // Suppression avec confirmation
  deleteGuide(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce guide ?')) {
      this.guideService.deleteGuide(id).subscribe({
        next: () => {
          this.guides = this.guides.filter(guide => guide.id !== id);
          console.log('Guide supprimé');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du guide', error);
        }
      });
    }
  }

}
