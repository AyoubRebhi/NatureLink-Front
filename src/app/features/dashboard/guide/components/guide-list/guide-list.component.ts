// guide-list.component.ts
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Guide } from 'src/app/core/models/guide';
import { GuideService } from 'src/app/core/services/guide.service';

@Component({
  selector: 'app-guide-list',
  templateUrl: './guide-list.component.html',
  styleUrls: ['./guide-list.component.scss']
})
export class GuideListComponent implements OnInit {
  guides: Guide[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private guideService: GuideService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadGuides();
  }

  loadGuides(): void {
    this.isLoading = true;
    this.guideService.getAllGuides().subscribe({
      next: (data) => {
        this.guides = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des guides';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  deleteGuide(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce guide ?')) {
      this.guideService.deleteGuide(id).subscribe({
        next: () => {
          this.loadGuides();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erreur lors de la suppression';
        }
      });
    }
  }
}
