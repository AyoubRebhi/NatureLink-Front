import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DisponibilityService } from 'src/app/core/services/disponibility.service';
import { Disponibility } from 'src/app/core/models/disponibility.model';
import { LogementService } from 'src/app/core/services/logement.service';
import { Logement } from 'src/app/core/models/logement.model';

@Component({
  selector: 'app-disponibility-add',
  templateUrl: './disponibility-add.component.html',
  styleUrls: ['./disponibility-add.component.scss'],
})
export class DisponibilityAddComponent implements OnInit {
  logementId: number = 0;
  startDate: string = '';
  endDate: string = '';
  logement: Logement | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private disponibilityService: DisponibilityService,
    private logementService: LogementService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.logementId = +params.get('logementId')!; // Get logementId from route
      this.loadLogementDetails(this.logementId); // Load logement details based on ID
    });
  }

  loadLogementDetails(logementId: number): void {
    this.logementService.getLogementById(logementId).subscribe({
      next: (logement: Logement) => {
        this.logement = logement; // Assign logement details to the variable
      },
      error: (err: any) => {
        console.error('Error fetching logement details:', err);
      },
    });
  }

  addDisponibility(): void {
    if (this.logementId) {
      const newDisponibility: Disponibility = {
        startDate: this.startDate,
        endDate: this.endDate,
        logementId: this.logementId, // Pass logementId when creating a new disponibility
      };

      this.disponibilityService.createDisponibility(newDisponibility).subscribe({
        next: (disponibility) => {
          console.log('Disponibility added:', disponibility);
          this.router.navigate(['/admin/logement/list']); // Redirect after successful creation
        },
        error: (err: any) => {
          console.error('Error adding disponibility:', err);
        },
      });
    } else {
      console.error('Logement ID is not available.');
    }
  }
}
