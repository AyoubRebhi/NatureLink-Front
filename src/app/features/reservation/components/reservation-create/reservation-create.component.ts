import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { StatutReservation } from 'src/app/core/models/statut-reservation.model';
import { TypeReservation } from 'src/app/core/models/type-reservation.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { PackService } from 'src/app/core/services/pack.service';
import { Pack } from 'src/app/core/models/pack.model';
import { HttpErrorResponse } from '@angular/common/http';

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
  numRooms: number = 1;
  selectedType: TypeReservation = TypeReservation.ACTIVITE;
  typeSpecificId: number = 1;
  packId: number | null = null;
  hasLogement: boolean = false;
  reservationTime: string = '';
  tablePreference: string = '';
  TypeReservation = TypeReservation;

  today: string;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  private numClientsSubject = new Subject<number>();
  private subscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private reservationService: ReservationService,
    private packService: PackService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
      const packId = parseInt(params['packId'], 10);
      const type = params['type'] as TypeReservation;
      const id = parseInt(params['id'], 10);

      if (packId && !isNaN(packId)) {
        this.packId = packId;
        this.selectedType = TypeReservation.PACK;
        this.typeSpecificId = packId;
        this.fetchPackDetails(packId);
      } else if (type && Object.values(TypeReservation).includes(type)) {
        this.selectedType = type;
        if (id && !isNaN(id)) {
          this.typeSpecificId = id;
        }
      }

      console.log('Selected Type:', this.selectedType, 'Type Specific ID:', this.typeSpecificId, 'Pack ID:', this.packId);
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

  private fetchPackDetails(packId: number): void {
    this.isLoading = true;
    this.packService.getPackById(packId).subscribe({
      next: (pack: Pack) => {
        this.hasLogement = pack.logements && pack.logements.length > 0;
        console.log('Pack Details:', pack, 'Has Logement:', this.hasLogement);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Failed to load pack details';
        console.error('Error fetching pack:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onNumClientsChange(): void {
    if (this.selectedType === TypeReservation.RESTAURANT && this.numClients > 4) {
      this.numClients = 4;
      this.errorMessage = 'Restaurant reservations are limited to 4 guests maximum.';
    }
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
    this.cdr.detectChanges();
  }

  trackByIndex(index: number): number {
    return index;
  }

  createReservation(): void {
    this.errorMessage = null;

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'Utilisateur non connecté. Veuillez vous reconnecter.';
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Validations
    if (this.selectedType === TypeReservation.RESTAURANT) {
      if (!this.reservationTime) {
        this.errorMessage = 'Veuillez sélectionner une heure de réservation.';
        this.cdr.detectChanges();
        return;
      }
      if (this.numClients > 4) {
        this.errorMessage = 'Les réservations de restaurant sont limitées à 4 personnes maximum.';
        this.cdr.detectChanges();
        return;
      }
      // Set dateFin to match dateDebut for restaurant reservations
      this.dateFin = new Date(this.dateDebut);
    } else if (this.dateFin < this.dateDebut) {
      this.errorMessage = 'La date de fin doit être postérieure à la date de début.';
      this.cdr.detectChanges();
      return;
    }

    if (this.clientNames.some(name => !name.trim())) {
      this.errorMessage = 'Veuillez remplir tous les noms des clients.';
      this.cdr.detectChanges();
      return;
    }
    if (this.selectedType === TypeReservation.LOGEMENT && this.numRooms < 1) {
      this.errorMessage = 'Veuillez entrer un nombre valide de chambres.';
      this.cdr.detectChanges();
      return;
    }
    if (this.selectedType === TypeReservation.PACK && this.hasLogement && this.numRooms < 1) {
      this.errorMessage = 'Veuillez entrer un nombre valide de chambres pour ce pack.';
      this.cdr.detectChanges();
      return;
    }
    if (!this.typeSpecificId || this.typeSpecificId <= 0) {
      this.errorMessage = 'Veuillez entrer un ID valide pour le type de réservation.';
      this.cdr.detectChanges();
      return;
    }

    // Combine dateDebut with reservationTime for restaurant reservations
    let effectiveDateDebut = new Date(this.dateDebut);
    if (this.selectedType === TypeReservation.RESTAURANT && this.reservationTime) {
      const [hours, minutes] = this.reservationTime.split(':').map(Number);
      effectiveDateDebut.setHours(hours, minutes, 0, 0);
    }

    // Set status based on reservation type
    const statut = this.selectedType === TypeReservation.EVENT || this.selectedType === TypeReservation.RESTAURANT
      ? StatutReservation.CONFIRMED
      : StatutReservation.PENDING;

    // Build reservation object
    const reservation: Reservation = {
      userId: userId,
      dateDebut: effectiveDateDebut,
      dateFin: new Date(this.dateFin),
      statut: statut,
      typeres: this.selectedType,
      numClients: this.numClients,
      clientNames: this.clientNames.map(name => name.trim()),
      numRooms: (this.selectedType === TypeReservation.LOGEMENT || (this.selectedType === TypeReservation.PACK && this.hasLogement)) ? this.numRooms : undefined,
      packId: this.selectedType === TypeReservation.PACK ? this.typeSpecificId : undefined,
      logementId: this.selectedType === TypeReservation.LOGEMENT ? this.typeSpecificId : undefined,
      transportId: this.selectedType === TypeReservation.TRANSPORT ? this.typeSpecificId : undefined,
      restaurantId: this.selectedType === TypeReservation.RESTAURANT ? this.typeSpecificId : undefined,
      eventId: this.selectedType === TypeReservation.EVENT ? this.typeSpecificId : undefined,
      activityId: this.selectedType === TypeReservation.ACTIVITE ? this.typeSpecificId : undefined
    };

    console.log('Reservation Payload:', JSON.stringify(reservation, null, 2));
    this.isLoading = true;
    this.cdr.detectChanges();

    this.reservationService.addReservation(reservation).subscribe({
      next: (response: Reservation) => {
        console.log('Réservation créée avec succès:', response);
        this.isLoading = false;

        // Store restaurant-specific fields in localStorage
        if (this.selectedType === TypeReservation.RESTAURANT && response.id) {
          const restaurantDetails = {
            reservationTime: this.reservationTime,
            tablePreference: this.tablePreference || 'No preference'
          };
          localStorage.setItem(`reservation_${response.id}`, JSON.stringify(restaurantDetails));
          console.log(`Stored restaurant details for reservation ${response.id}:`, restaurantDetails);
        }

        alert('Réservation créée avec succès !');
        this.resetForm();
        this.router.navigate(['/reservation/reservation-list']);
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      }
    });
  }

  private resetForm(): void {
    this.numClients = 1;
    this.clientNames = [''];
    this.dateDebut = new Date();
    this.dateFin = new Date();
    this.numRooms = 1;
    this.selectedType = TypeReservation.ACTIVITE;
    this.typeSpecificId = 1;
    this.packId = null;
    this.hasLogement = false;
    this.reservationTime = '';
    this.tablePreference = '';
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

  goBackToList(): void {
    this.router.navigate(['/reservation/reservation-list']);
  }
}