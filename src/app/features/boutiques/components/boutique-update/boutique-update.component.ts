declare const google: any;

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Boutique } from 'src/app/core/models/boutique.module';
import { BoutiqueService } from 'src/app/services/boutique.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-boutique-update',
  templateUrl: './boutique-update.component.html',
  styleUrls: ['./boutique-update.component.scss']
})
export class BoutiqueUpdateComponent implements OnInit {
  BoutiqueForm!: FormGroup;
  selectedImage: File | null = null;
  base64Image: string = '';
  boutiqueId!: number;

  latitude!: number;
  longitude!: number;
  map: any;
  marker: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private boutiqueservice: BoutiqueService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.route.params.subscribe(params => {
      this.boutiqueId = +params['id'];
      this.boutiqueservice.getBoutiqueById(this.boutiqueId).subscribe((boutiqueData: any) => {
        this.BoutiqueForm.patchValue({
          nom: boutiqueData.nom,
          addresse: boutiqueData.adresse,
          email: boutiqueData.email,
          telephone: boutiqueData.telephone
        });

        this.geocodeAdresse(boutiqueData.adresse);
      });
    });

    setTimeout(() => {
      this.initMap(); // Attendre que le DOM soit prêt
    }, 500);
  }

  initializeForm(): void {
    this.BoutiqueForm = this.fb.group({
      nom: ['', Validators.required],
      addresse: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$')]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
    });
  }

  onSubmit(): void {
    if (this.BoutiqueForm.invalid) return;

    const formValues = this.BoutiqueForm.value;

    const updatedBoutique: any = {
      id: this.boutiqueId,
      nom: formValues.nom,
      adresse: formValues.addresse,
      email: formValues.email,
      telephone: formValues.telephone,
      image: this.base64Image,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.boutiqueservice.updateBoutique(this.boutiqueId, updatedBoutique).subscribe(() => {
      this.router.navigate(['/admin/boutiques/list_boutiques']);
    });
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    this.selectedImage = file;

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.base64Image = reader.result as string;
        console.log("Base64 Image:", this.base64Image);
      };

      reader.readAsDataURL(file);
    }
  }

  geocodeAdresse(adresse: string): void {
    const cleaned = `${adresse}, Tunisia`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleaned)}&countrycodes=tn`;
        this.http.get<any[]>(url).subscribe((data) => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        this.latitude = parseFloat(lat);
        this.longitude = parseFloat(lon);
        this.initMap();
      } else {
        console.warn("Adresse introuvable:", adresse);
      }
    });
  }

  initMap(): void {
    if (!this.latitude || !this.longitude) {
      this.latitude = 36.8065; // Tunis par défaut
      this.longitude = 10.1815;
    }

    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    this.map = new google.maps.Map(mapElement, {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 14,
    });

    this.marker = new google.maps.Marker({
      position: { lat: this.latitude, lng: this.longitude },
      map: this.map,
      draggable: true,
    });

    this.map.addListener("click", (e: any) => {
      this.latitude = e.latLng.lat();
      this.longitude = e.latLng.lng();
      this.marker.setPosition({ lat: this.latitude, lng: this.longitude });
      console.log("Nouvelle position :", this.latitude, this.longitude);
    });
  }
}
