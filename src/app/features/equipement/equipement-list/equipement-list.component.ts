import { Component, OnInit } from '@angular/core';
import { EquipementService } from 'src/app/core/services/equipement.service';
import { Equipement } from 'src/app/core/models/equipement.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipement-list',
  templateUrl: './equipement-list.component.html',
})
export class EquipementListComponent implements OnInit {
  equipements: Equipement[] = [];

  constructor(private equipementService: EquipementService, private router: Router) {}

  ngOnInit(): void {
    this.loadEquipements();
  }

  loadEquipements() {
    this.equipementService.getAll().subscribe((data) => {
      this.equipements = data;
    });
  }

  deleteEquipement(id: number) {
    if (confirm('Are you sure you want to delete this equipement?')) {
      this.equipementService.delete(id).subscribe({
        next: () => {
          this.loadEquipements();
        },
        error: (err) => {
          console.error('Error deleting equipement:', err);
          alert('This equipement cannot be deleted. It may be associated with a logement.');
        }
      });
    }
  }
}
