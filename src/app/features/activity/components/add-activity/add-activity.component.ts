import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from '../../../../core/services/activity.service';
import { Activity } from '../../../../core/models/activity.model';
import * as L from 'leaflet';
import { NgForm } from '@angular/forms'; // Add this import

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})

export class AddActivityComponent implements AfterViewInit {
  activity: Activity = {
    name: '',
    description: '',
    providerId: 1,
    location: '',
    duration: 0,
    price: 0,
    maxParticipants: 0,
    difficultyLevel: '',
    requiredEquipment: [],
    imageUrls: [],
    type: '',
    mood: [],
    tags: []
  };

  // Add form validation patterns
  validationPatterns = {
    name: /^[a-zA-Z0-9\s\-']{3,100}$/,
    description: /^[\s\S]{20,2000}$/,
    duration: /^[1-9]\d*$/, // Positive integers only
    price: /^\d+(\.\d{1,2})?$/, // Decimal with up to 2 places
    maxParticipants: /^[1-9]\d*$/ // Positive integers only
  };

  // Add validation messages
  validationMessages = {
    name: {
      required: 'Activity name is required',
      pattern: 'Name must be 3-100 characters (letters, numbers, spaces, hyphens, apostrophes)'
    },
    description: {
      required: 'Description is required',
      pattern: 'Description must be 20-2000 characters'
    },
    location: {
      required: 'Location is required'
    },
    duration: {
      required: 'Duration is required',
      pattern: 'Duration must be a positive number (minutes)'
    },
    price: {
      required: 'Price is required',
      pattern: 'Price must be a positive number (e.g. 10 or 10.50)'
    },
    maxParticipants: {
      required: 'Max participants is required',
      pattern: 'Must be a positive number'
    },
    type: {
      required: 'Activity type is required'
    },
    images: {
      required: 'At least one image is required'
    }
  };



  equipmentInput = '';
  moodInput = '';
  tagInput = '';
  selectedImages: File[] = [];
  //CRINGE L MAP
  map!: L.Map;
  marker!: L.Marker;
  isLoading = false;

  // Add these new properties
  generatedImages: string[] = [];
  isGeneratingImages = false;

   // Add these loading states
   isGeneratingActivity = false;
   isGeocoding = false;

  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  constructor(private activityService: ActivityService, private router: Router) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0); // ← Force delay to ensure full rendering
  }

  initMap(): void {
    this.map = L.map('map', {
      center: [36.8, 10.2],
      zoom: 7,
      zoomControl: true
    });

    setTimeout(() => {
      this.map.invalidateSize();  // 👈 Forces map to recalculate dimensions
    }, 0);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'assets/img/icon-map.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    this.map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map);
      }

      await this.reverseGeocode(lat, lng);
    });
  }

  async reverseGeocode(lat: number, lng: number): Promise<void> {
    this.isLoading = true;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await res.json();
      const address = data.address;
      
      // Get simplified location (e.g., "Marsa, Tunisia")
      let location = '';
      if (address.city || address.town || address.village) {
        location = address.city || address.town || address.village;
      } else if (address.county) {
        location = address.county;
      }
      
      if (address.state || address.country) {
        location += location ? `, ${address.country}` : address.country;
      }
      
      this.activity.location = location || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      // Center the map on the selected location
      this.map.setView([lat, lng], 12);
      
    } catch {
      this.activity.location = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } finally {
      this.isLoading = false;
    }
  }
  clearLocation(): void {
    this.activity.location = '';
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = undefined!;
    }
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.selectedImages = Array.from(input.files);
  }

  onSubmit(): void {
    this.activity.requiredEquipment = this.equipmentInput.split(',').map(e => e.trim());
    this.activity.mood = this.moodInput.split(',').map(m => m.trim());
    this.activity.tags = this.tagInput.split(',').map(t => t.trim());

    if (!this.selectedImages.length) return alert('Please upload at least one image.');

    const formData = new FormData();
    this.selectedImages.forEach(img => formData.append('images', img));
    formData.append('activity', new Blob([JSON.stringify(this.activity)], { type: 'application/json' }));

    this.activityService.addActivityWithImages(formData).subscribe({
      next: () => {
        alert('Activity added!');
        this.router.navigate(['/admin/activity']);
      },
      error: err => {
        console.error('Error adding activity:', err);
        alert('❌ Failed to add activity.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/activity']);
  }

  generateActivity(): void {
    // Set loading states
    this.isGeneratingActivity = true;
    this.isGeocoding = true;
  
    const promptParams = {
      location: this.activity.location || '',
      type: this.activity.type || '',
      difficulty: this.activity.difficultyLevel || '',
      mood: this.moodInput || '',
      tags: this.tagInput || ''
    };
  
    this.activityService.generateActivityFromAI(promptParams).subscribe({
      next: async (res) => {
        try {
          const response = JSON.parse(res.choices[0].message.content);
          Object.assign(this.activity, response);
          this.moodInput = response.mood?.join(', ') || '';
          this.tagInput = response.tags?.join(', ') || '';
  
          if (response.location) {
            const coords = await this.geocodeLocation(response.location);
            if (coords) {
              this.updateMapMarker(coords.lat, coords.lng);
            }
          }
        } catch (e) {
          console.error('Error:', e);
          alert('⚠️ Failed to process generated activity');
        } finally {
          this.isGeneratingActivity = false;
          this.isGeocoding = false;
        }
      },
      error: (err) => {
        console.error('Error:', err);
        alert('⚠️ Failed to generate activity');
        this.isGeneratingActivity = false;
        this.isGeocoding = false;
      }
    });
  }
  
  private updateMapMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      const customIcon = L.icon({
        iconUrl: 'assets/img/icon-map.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    }
    this.map.setView([lat, lng], 12);
  }
  generateImages(customQuery?: string): void {
    if (!this.activity.description && !customQuery) {
      alert('Please enter a description or search terms');
      return;
    }

    this.isGeneratingImages = true;
    const searchQuery = customQuery || this.activity.description;
    
    this.activityService.getActivityImages(searchQuery).subscribe({
      next: (response) => {
        this.generatedImages = response.images;
        this.isGeneratingImages = false;
      },
      error: (err) => {
        console.error('Error generating images:', err);
        alert('Failed to generate images');
        this.isGeneratingImages = false;
      }
    });
  }

  addToSelectedImages(imageUrl: string): void {
    // Convert data URL to File object if needed
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'generated-image.jpg', { type: 'image/jpeg' });
        this.selectedImages.push(file);
        alert('Image added to selection!');
      })
      .catch(err => {
        console.error('Error adding image:', err);
        alert('Failed to add image');
      });
  }
  async geocodeLocation(locationName: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch {
      return null;
    }
  }
  async onLocationChange(): Promise<void> {
    if (this.activity.location) {
      const coords = await this.geocodeLocation(this.activity.location);
      if (coords) {
        // Update map position
        if (this.marker) {
          this.marker.setLatLng([coords.lat, coords.lng]);
        } else {
          const customIcon = L.icon({
            iconUrl: 'assets/img/icon-map.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          });
          this.marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(this.map);
        }
        this.map.setView([coords.lat, coords.lng], 12);
      }
    }
  }

  
}
