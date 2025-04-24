declare const google: any;
import { Component, OnInit } from '@angular/core';
import { BoutiqueService } from 'src/app/core/services/boutique.service';
import { Produit } from 'src/app/core/models/produit.module';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-boutique-info',
  templateUrl: './boutique-info.component.html',
  styleUrls: ['./boutique-info.component.scss']
})
export class BoutiqueInfoComponent implements OnInit {
  boutiqueId!: number;
  products: Produit[] = [];
  boutiqueDetails: any;
  isLoading = true;
  isAdminView = false;

  latitude!: number;
  longitude!: number;

  userLatitude!: number;
  userLongitude!: number;

  map: any;
  directionsService: any;
  directionsRenderer: any;

  constructor(private boutiqueservice: BoutiqueService, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.boutiqueId = +params['id'];
      this.loadBoutiqueDetails();
      this.loadProduits();
    });
    this.route.data.subscribe((data) => {
      this.isAdminView = data['adminView'] || false;
    });
    this.getUserLocation();
  }

  loadBoutiqueDetails(): void {
    this.boutiqueservice.getBoutiqueById(this.boutiqueId).subscribe({
      next: (boutique) => {
        this.boutiqueDetails = boutique;
        if (this.boutiqueDetails && this.boutiqueDetails.adresse) {
          let address = this.boutiqueDetails.adresse.trim();

          // Nettoyage de l'adresse : retirer les Plus Codes et ce qui suit
          const plusCodeRegex = /\b[\w]{4,}\+[\w]{2,}\b.*$/;
          address = address.replace(plusCodeRegex, '').trim();
  
          // Optionnel : retirer Tunis ou Tunisie à la fin si nécessaire
          address = address.replace(/\bTunis(ie)?\b.*$/i, '').trim();
  
          // Geocode the cleaned address
          this.geocodeAdresseAndDisplayMap(address);
        }
      },
      error: (err) => {
        console.error('Error loading boutique details:', err);
      }
    });
  }

  loadProduits(): void {
    this.boutiqueservice.getProduitsByBoutiqueId(this.boutiqueId).subscribe({
      next: (produits) => {
        this.products = produits;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      }
    });
  }

  deleteProduit(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.boutiqueservice.deleteProduitByBoutiqueId(this.boutiqueId, productId).subscribe(() => {
        this.products = this.products.filter(event => event.id !== productId);
        alert('Product deleted successfully!');
      }, error => {
        console.error('Delete failed:', error);
        alert('Failed to delete the product.');
      });
    }
  }

  geocodeAdresseAndDisplayMap(adresse: string): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`;
   

    this.http.get<any[]>(url).subscribe((data) => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        this.latitude = parseFloat(lat);
        this.longitude = parseFloat(lon);
        this.loadGoogleMap(this.latitude, this.longitude);
        if (this.userLatitude && this.userLongitude) {
          this.calculateRoute(this.userLatitude, this.userLongitude, this.latitude, this.longitude); // Get directions
        }
      } else {
        console.warn("Address not found:", adresse);
      }
    });
  }

  loadGoogleMap(lat: number, lng: number): void {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat, lng },
      zoom: 14,
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: this.boutiqueDetails?.nom || "Boutique",
    });
    
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userLatitude = position.coords.latitude;
        this.userLongitude = position.coords.longitude;
        console.log("User location:", this.userLatitude, this.userLongitude);
        if (this.latitude && this.longitude) {
          this.calculateRoute(this.userLatitude, this.userLongitude, this.latitude, this.longitude);
        }
      }, (error) => {
        console.error("Error getting user location:", error);
      });
    } else {
      console.error("Geolocation not supported in this browser");
    }
  }

  calculateRoute(originLat: number, originLng: number, destLat: number, destLng: number): void {
    const request = {
      origin: new google.maps.LatLng(originLat, originLng),
      destination: new google.maps.LatLng(destLat, destLng),
      travelMode: google.maps.TravelMode.DRIVING, // You can also use WALKING, BICYCLING, etc.
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error("Directions request failed due to:", status);
      }
    });
  }
}
