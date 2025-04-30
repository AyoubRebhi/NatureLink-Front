import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from '../../../../core/services/activity.service';
import { Activity } from '../../../../core/models/activity.model';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';

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

  equipmentInput = '';
  moodInput = '';
  tagInput = '';
  selectedImages: File[] = [];
  map!: L.Map;
  marker!: L.Marker;
  isLoading = false;
  generatedImages: string[] = [];
  isGeneratingImages = false;
  isGeneratingActivity = false;
  isGeocoding = false;
  isSubmitting = false;
  // Add this property to your component class
  formSubmitted = false;

  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  constructor(
    private activityService: ActivityService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  initMap(): void {
    this.map = L.map('map', {
      center: [36.8, 10.2],
      zoom: 7,
      zoomControl: true
    });

    setTimeout(() => {
      this.map.invalidateSize();
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
      this.map.setView([lat, lng], 12);

    } catch (err) {
      this.activity.location = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      this.toastr.error('Failed to get location details');
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
    if (input.files) {
      this.selectedImages = Array.from(input.files);
    }
  }

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  removeSelectedImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.selectedImages.length === 0) {
      this.toastr.error('Please upload at least one image');
      return;
    }

    this.isSubmitting = true;
    this.activity.requiredEquipment = this.equipmentInput.split(',').map(e => e.trim());
    this.activity.mood = this.moodInput.split(',').map(m => m.trim());
    this.activity.tags = this.tagInput.split(',').map(t => t.trim());

    const formData = new FormData();
    this.selectedImages.forEach(img => formData.append('images', img));
    formData.append('activity', new Blob([JSON.stringify(this.activity)], { type: 'application/json' }));

    this.activityService.addActivityWithImages(formData).subscribe({
      next: () => {
        this.toastr.success('Activity added successfully!');
        this.router.navigate(['/admin/activity']);
      },
      error: (err) => {
        console.error('Error adding activity:', err);
        this.toastr.error('Failed to add activity');
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/activity']);
  }

  generateActivity(): void {
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
          this.toastr.success('Activity generated successfully!');
        } catch (e) {
          console.error('Error:', e);
          this.toastr.error('Failed to process generated activity');
        } finally {
          this.isGeneratingActivity = false;
          this.isGeocoding = false;
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.toastr.error('Failed to generate activity');
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
      this.toastr.warning('Please enter a description or search terms');
      return;
    }

    this.isGeneratingImages = true;
    const searchQuery = customQuery || this.activity.description;

    this.activityService.getActivityImages(searchQuery).subscribe({
      next: (response) => {
        this.generatedImages = response.images;
        this.toastr.success('Images generated successfully!');
        this.isGeneratingImages = false;
      },
      error: (err) => {
        console.error('Error generating images:', err);
        this.toastr.error('Failed to generate images');
        this.isGeneratingImages = false;
      }
    });
  }

  addToSelectedImages(imageUrl: string): void {
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'generated-image.jpg', { type: 'image/jpeg' });
        this.selectedImages.push(file);
        this.toastr.success('Image added to selection!');
      })
      .catch(err => {
        console.error('Error adding image:', err);
        this.toastr.error('Failed to add image');
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
      this.toastr.error('Failed to geocode location');
      return null;
    }
  }
}