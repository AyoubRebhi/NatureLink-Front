import { Component, OnInit } from '@angular/core';
import { DisponibilityService } from 'src/app/core/services/disponibility.service';
import { LogementService } from 'src/app/core/services/logement.service';  // Add this import
import { Disponibility } from 'src/app/core/models/disponibility.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-disponibility-list',
  templateUrl: './disponibility-list.component.html',
  styleUrls: ['./disponibility-list.component.scss'],
  providers: [DatePipe],
})
export class DisponibilityListComponent implements OnInit {
  disponibilities: Disponibility[] = [];
  logements: any[] = []; // To store the logements

  constructor(
    private disponibilityService: DisponibilityService,
    private logementService: LogementService,  // Inject LogementService
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getDisponibilities();
  }

  // Fetch all disponibilities from the backend
  getDisponibilities(): void {
    this.disponibilityService.getAllDisponibilities().subscribe({
      next: (data: Disponibility[]) => {
        console.log('Fetched Disponibilities:', data);
        this.disponibilities = data;

        // For each disponibility, fetch its associated logement title
        this.disponibilities.forEach((dispo) => {
          this.getLogementTitle(dispo.logementId); // Call the method to fetch the title
        });
      },
      error: (error) => {
        console.error('Error fetching disponibilities:', error);
      },
    });
  }

  // Fetch the logement title by ID
  getLogementTitle(logementId: number): void {
    this.logementService.getLogementById(logementId).subscribe({
      next: (logement) => {
        // Find the disponibility and attach the logement title
        const dispo = this.disponibilities.find((d) => d.logementId === logementId);
        if (dispo) {
          dispo.logementTitle = logement.titre;  // Assuming the logement object has a 'titre' field
        }
      },
      error: (error) => {
        console.error('Error fetching logement:', error);
      },
    });
  }

  // Format date using Angular's DatePipe
  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'shortDate') || '';
  }
}
