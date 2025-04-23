import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { StatutReservation } from 'src/app/core/models/statut-reservation.model';
import { TypeReservation } from 'src/app/core/models/type-reservation.model';
import { Router, ActivatedRoute } from '@angular/router';
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
  selectedType: TypeReservation = TypeReservation.ACTIVITE;
  typeSpecificId: number = 1;

  today: string;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  private numClientsSubject = new Subject<number>();
  private subscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.today = new Date().toISOString().split('T')[0];
    const cachedStatutOptions = localStorage.getItem('statutOptions');
    if (cachedStatutOptions) {
      this.statutOptions = JSON.parse(cachedStatutOptions);
    } else {
      localStorage.setItem('statutOptions', JSON.stringify(this.statutOptions));
    }
  }

  ngOnInit(): void {
    // Subscribe to route query parameters to get type and ID
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const type = params['type'] as TypeReservation;
      const id = parseInt(params['id'], 10);

      if (type && Object.values(TypeReservation).includes(type)) {
        this.selectedType = type;
      }
      if (id && !isNaN(id)) {
        this.typeSpecificId = id;
      }
    });

    this.generateClientInputs();
    this.subscription = this.numClientsSubject.pipe(debounceTime(300)).subscribe(() => {
      this.generateClientInputs();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
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
    if (this.selectedType === TypeReservation.LOGEMENT && this.numRooms < 1) {
      this.errorMessage = 'Veuillez entrer un nombre valide de chambres.';
      return;
    }
    if (!this.clientId || this.clientId <= 0) {
      this.errorMessage = 'Veuillez entrer un ID de client valide.';
      return;
    }
    if (!this.typeSpecificId || this.typeSpecificId <= 0) {
      this.errorMessage = 'Veuillez entrer un ID valide pour le type de réservation.';
      return;
    }

    // Build reservation object dynamically
    const reservation: Reservation = {
      userId: this.clientId,
      dateDebut: new Date(this.dateDebut),
      dateFin: new Date(this.dateFin),
      statut: this.selectedStatut,
      typeres: this.selectedType,
      numClients: this.numClients,
      clientNames: this.clientNames.map(name => name.trim()),
      numRooms: this.selectedType === TypeReservation.LOGEMENT ? this.numRooms : undefined,
      logementId: this.selectedType === TypeReservation.LOGEMENT ? this.typeSpecificId : undefined,
      transportId: this.selectedType === TypeReservation.TRANSPORT ? this.typeSpecificId : undefined,
      restaurantId: this.selectedType === TypeReservation.RESTAURANT ? this.typeSpecificId : undefined,
      eventId: this.selectedType === TypeReservation.EVENT ? this.typeSpecificId : undefined,
      activityId: this.selectedType === TypeReservation.ACTIVITE ? this.typeSpecificId : undefined
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
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
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
    this.selectedType = TypeReservation.ACTIVITE;
    this.typeSpecificId = 1;
    this.errorMessage = null;
  }

  goBackToList(): void {
    this.router.navigate(['/reservation/reservation-list']);
  }
}