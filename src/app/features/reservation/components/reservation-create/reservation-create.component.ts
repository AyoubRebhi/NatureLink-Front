import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { StatutReservation } from 'src/app/core/models/statut-reservation.model';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-reservation-create',
  templateUrl: './reservation-create.component.html',
  styleUrls: ['./reservation-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationCreateComponent implements OnInit, OnDestroy {
  numClients: number = 1;
  clientNames: string[] = [''];
  dateDebut: Date = new Date();
  dateFin: Date = new Date();
  selectedStatut: StatutReservation = StatutReservation.EN_ATTENTE;
  statutOptions: StatutReservation[] = Object.values(StatutReservation);
  numRooms: number = 1;
  clientId: number = 8;
  logementId: number = 1;
  today: string;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  private numClientsSubject = new Subject<number>();
  private subscription?: Subscription;

  constructor(private reservationService: ReservationService, private router: Router) {
    this.today = new Date().toISOString().split('T')[0];
    // Load statut options from local cache
    const cachedStatutOptions = localStorage.getItem('statutOptions');
    if (cachedStatutOptions) {
      this.statutOptions = JSON.parse(cachedStatutOptions);
    } else {
      localStorage.setItem('statutOptions', JSON.stringify(this.statutOptions));
    }
  }

  ngOnInit(): void {
    this.generateClientInputs();
    this.subscription = this.numClientsSubject.pipe(debounceTime(300)).subscribe(() => {
      this.generateClientInputs();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onNumClientsChange(): void {
    this.numClientsSubject.next(this.numClients);
  }

  generateClientInputs(): void {
    if (this.numClients < 1) {
      this.numClients = 1;
    }
    if (this.clientNames.length !== this.numClients) {
      const newClientNames = Array(this.numClients).fill('');
      for (let i = 0; i < Math.min(this.clientNames.length, this.numClients); i++) {
        newClientNames[i] = this.clientNames[i] || '';
      }
      this.clientNames = newClientNames;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  createReservation(): void {
    this.errorMessage = null;

    // Validations
    if (this.dateFin < this.dateDebut) {
      this.errorMessage = 'La date de fin doit être postérieure à la date de début.';
      return;
    }
    if (this.clientNames.some(name => !name.trim())) {
      this.errorMessage = 'Veuillez remplir tous les noms des clients.';
      return;
    }
    if (this.logementId && this.numRooms < 1) {
      this.errorMessage = 'Veuillez entrer un nombre valide de chambres.';
      return;
    }
    if (!this.clientId || this.clientId <= 0) {
      this.errorMessage = 'Veuillez entrer un ID de client valide.';
      return;
    }

    const reservation: Reservation = {
      userId: this.clientId,
      dateDebut: new Date(this.dateDebut),
      dateFin: new Date(this.dateFin),
      statut: this.selectedStatut,
      numClients: this.numClients,
      clientNames: this.clientNames.map(name => name.trim()), // Trim names
      numRooms: this.logementId ? this.numRooms : undefined,
      logementId: this.logementId || undefined
    };

    console.log('Reservation Payload:', JSON.stringify(reservation, null, 2));
    this.isLoading = true;

    this.reservationService.addReservation(reservation).subscribe({
      next: (response) => {
        console.log('Réservation créée avec succès:', response);
        this.isLoading = false;
        alert('Réservation créée avec succès !');
        this.resetForm();
        this.router.navigate(['/reservation/reservation-list']);
      },
      error: (error) => {
        console.error('Error creating reservation:', error);
        this.isLoading = false;

        // Handle error from GlobalExceptionHandler
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message; // e.g., "🚫 Invalid client name(s)..."
          alert(`⚠️ ${this.errorMessage}`);
        } else if (error.status === 500) {
          this.errorMessage = 'Erreur serveur interne. Veuillez réessayer plus tard.';
          alert(`⚠️ ${this.errorMessage}`);
        } else {
          this.errorMessage = 'Échec de la création de la réservation. Veuillez réessayer.';
          alert(`⚠️ ${this.errorMessage}`);
        }
      }
    });
  }

  private resetForm(): void {
    this.numClients = 1;
    this.clientNames = [''];
    this.dateDebut = new Date();
    this.dateFin = new Date();
    this.selectedStatut = StatutReservation.EN_ATTENTE;
    this.numRooms = 1;
    this.clientId = 8;
    this.logementId = 1;
    this.errorMessage = null;
  }

  goBackToList(): void {
    this.router.navigate(['/reservation/reservation-list']);
  }
}