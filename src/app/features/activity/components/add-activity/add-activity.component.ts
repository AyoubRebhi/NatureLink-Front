import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from '../../../../core/services/activity.service';
import { Activity } from '../../../../core/models/activity.model';
import * as L from 'leaflet';

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
  //CRINGE L MAP
  map!: L.Map;
  marker!: L.Marker;
  isLoading = false;
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
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      this.activity.location = data.display_name || `${lat}, ${lng}`;
    } catch {
      this.activity.location = `${lat}, ${lng}`;
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
    const promptParams = {
      location: this.activity.location || '',
      type: this.activity.type || '',
      difficulty: this.activity.difficultyLevel || '',
      mood: this.moodInput || '',
      tags: this.tagInput || ''
    };

    this.activityService.generateActivityFromAI(promptParams).subscribe({
      next: res => {
        try {
          const generated = JSON.parse(res.choices[0].message.content);
          Object.assign(this.activity, generated);
          this.moodInput = generated.mood.join(', ');
          this.tagInput = generated.tags.join(', ');
        } catch (e) {
          alert('⚠️ Failed to parse generated activity.');
        }
      },
      error: err => {
        console.error('Error generating activity:', err);
        alert('⚠️ Failed to generate activity.');
      }
    });
  }
}
