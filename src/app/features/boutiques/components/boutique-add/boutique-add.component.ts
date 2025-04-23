declare const google: any;

import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Boutique } from 'src/app/core/models/boutique.module';
import { Produit } from 'src/app/core/models/produit.module';
import { BoutiqueService } from 'src/app/services/boutique.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-boutique-add',
  templateUrl: './boutique-add.component.html',
  styleUrls: ['./boutique-add.component.scss']
})
export class BoutiqueAddComponent implements OnInit, AfterViewInit  {
  BoutiqueForm !:FormGroup;
  selectedImage: File | null = null;
    base64Image: string = '';
    map: any;
    marker: any;
    showMap: boolean = false;

    newBoutique: Boutique = {
      nom:'',
      adresse: '',
      email: '',
      telephone: '',
      image:'',
      produits: [],
    };
    constructor(private fb:FormBuilder,private boutiqueservice:BoutiqueService,private router:Router ){}
    ngOnInit(): void {
      this.initializeForm();
      
    }
    ngAfterViewInit(): void {
      this.initMap();
    }
    initMap(): void {
      const defaultLocation = { lat: 36.8065, lng: 10.1815 }; // Example: Tunis center
  
      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: defaultLocation,
        zoom: 13,
      });
  
      this.map.addListener("click", (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        this.placeMarkerAndPan(lat, lng);
        this.getAddressFromCoords(lat, lng);
      });
    }
    placeMarkerAndPan(lat: number, lng: number): void {
      if (this.marker) {
        this.marker.setMap(null);
      }
  
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
      });
  
      this.map.panTo({ lat, lng });
    }
  
    getAddressFromCoords(lat: number, lng: number): void {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: lat, lng: lng };
  
      geocoder.geocode({ location: latlng }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const formattedAddress = results[0].formatted_address;
          this.BoutiqueForm.get('adresse')?.setValue(formattedAddress);
          console.log('Extracted address:', formattedAddress);
        } else {
          console.warn('Geocoder failed due to:', status);
        }
      });
    }


    initializeForm(): void {
      this.BoutiqueForm = this.fb.group({
        nom: ['', Validators.required],
        adresse: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$')]],
        Telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      });
    }
    
  onSubmit(): void {
    if (this.BoutiqueForm.valid) {
      this.newBoutique.nom=this.BoutiqueForm.value.nom;
      this.newBoutique.email=this.BoutiqueForm.value.email;
      this.newBoutique.telephone=this.BoutiqueForm.value.Telephone;
      this.newBoutique.adresse=this.BoutiqueForm.value.adresse;
      this.newBoutique.image=this.base64Image;
      console.log('Form submitted:', this.BoutiqueForm.value);
      console.log('Event object:', this.newBoutique);
  
      // Call the service to save the event
      this.boutiqueservice.createBoutique(this.newBoutique).subscribe(response => {
        console.log('Event added:', response);
        this.router.navigate(['/admin/boutiques/list_boutiques']);
      });
    } else {
      // Mark all fields as touched to trigger validation
      this.BoutiqueForm.markAllAsTouched();
    }
  }
  handleUpload(event: any) {
    const file = event.target.files[0];
    this.selectedImage = file;
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = () => {
        this.base64Image = reader.result as string; // Store the base64 string
        console.log("Base64 Image:", this.base64Image);
      };
  
      reader.readAsDataURL(file); // Convert file to base64
    }
  }
  onAdresseFieldFocus(): void {
    this.showMap = true;
  
    setTimeout(() => {
      this.initMap(); // Initialize after DOM updates
    }, 100);
  }
}
