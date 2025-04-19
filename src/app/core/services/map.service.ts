import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: L.Map | null = null;
  private routingControl: L.Routing.Control | null = null;
  private startMarker: L.Marker | null = null;
  private endMarker: L.Marker | null = null;
  markers: any;

  // Méthodes existantes
  getStartLatLng(): L.LatLng | null {
    return this.startMarker?.getLatLng() || null;
  }
  
  getEndLatLng(): L.LatLng | null {
    return this.endMarker?.getLatLng() || null;
  }
  
  hasBothMarkers(): boolean {
    return !!this.startMarker && !!this.endMarker;
  }

  initMap(elementId: string, lat: number, lng: number): void {
    this.map = L.map(elementId).setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  getMap(): L.Map | null {
    return this.map;
  }

  async reverseGeocode(latlng: L.LatLng): Promise<string | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.address) {
        const addressParts = [];
        if (data.address.road) addressParts.push(data.address.road);
        if (data.address.house_number) addressParts.push(data.address.house_number);
        if (data.address.city || data.address.town || data.address.village) {
          addressParts.push(data.address.city || data.address.town || data.address.village);
        }
        return addressParts.join(', ') || data.display_name || null;
      }
      return null;
    } catch (error) {
      console.error('Erreur de reverse geocoding:', error);
      return null;
    }
  }

  addMarker(latlng: L.LatLng, isStart: boolean): void {
    if (!this.map) throw new Error('Map not initialized');

    const marker = L.marker(latlng, {
      draggable: true,
      icon: L.icon({
        iconUrl: 'assets/img/icon2.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }).addTo(this.map)
      .bindPopup(isStart ? 'Point de départ' : 'Point d\'arrivée');

    if (isStart) {
      if (this.startMarker && this.map) this.map.removeLayer(this.startMarker);
      this.startMarker = marker;
    } else {
      if (this.endMarker && this.map) this.map.removeLayer(this.endMarker);
      this.endMarker = marker;
    }

    marker.on('dragend', () => {
      if (this.startMarker && this.endMarker) {
        this.calculateDistance();
      }
    });
  }

  removeMarker(isDeparture: boolean): void {
    if (!this.map) return;
    
    if (isDeparture && this.startMarker) {
      this.map.removeLayer(this.startMarker);
      this.startMarker = null;
    } else if (!isDeparture && this.endMarker) {
      this.map.removeLayer(this.endMarker);
      this.endMarker = null;
    }
  }

  hasMarker(isDeparture: boolean): boolean {
    return isDeparture ? !!this.startMarker : !!this.endMarker;
  }

  async calculateDistance(): Promise<number> {
    if (!this.map || !this.startMarker || !this.endMarker) {
      throw new Error('Map or markers not initialized');
    }

    const startLatLng = this.startMarker.getLatLng();
    const endLatLng = this.endMarker.getLatLng();

    return new Promise((resolve, reject) => {
      if (this.routingControl && this.map) {
        this.map.removeControl(this.routingControl);
      }

      const planOptions: L.Routing.PlanOptions = {
        createMarker: () => false,
        draggableWaypoints: false,
        addWaypoints: false
      };

      const plan = new L.Routing.Plan([
        L.Routing.waypoint(startLatLng),
        L.Routing.waypoint(endLatLng)
      ], planOptions);

      if (!this.map) throw new Error('Map not initialized');

      this.routingControl = L.Routing.control({
        waypoints: [startLatLng, endLatLng],
        routeWhileDragging: false,
        show: false,
        plan: plan,
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        })
      }).addTo(this.map);

      this.routingControl.getContainer()?.remove();

      this.routingControl.on('routesfound', (e) => {
        const routes = e.routes;
        if (routes?.[0]?.summary?.totalDistance) {
          resolve(routes[0].summary.totalDistance / 1000);
        } else {
          reject(new Error('No valid route found'));
        }
      });

      this.routingControl.on('routingerror', (e) => {
        reject(new Error(e.error?.message || 'Unknown routing error'));
      });
    });
  }

  clearMap(): void {
    if (!this.map) return;

    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }
    if (this.startMarker) {
      this.map.removeLayer(this.startMarker);
      this.startMarker = null;
    }
    if (this.endMarker) {
      this.map.removeLayer(this.endMarker);
      this.endMarker = null;
    }
  }

  clearMarkers(): void {
    if (!this.map) return;

    if (this.startMarker) {
      this.map.removeLayer(this.startMarker);
      this.startMarker = null;
    }
    if (this.endMarker) {
      this.map.removeLayer(this.endMarker);
      this.endMarker = null;
    }
  }

  async geocodeAddress(address: string): Promise<L.LatLng | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        return L.latLng(lat, lon);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erreur de géocodage :', error);
      return null;
    }
  }

  // Nouvelles méthodes pour gérer les noms de ville
  async getCityName(latlng: L.LatLng): Promise<string | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.address) {
        return data.address.city 
               || data.address.town 
               || data.address.village 
               || data.address.municipality 
               || null;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du nom de la ville:', error);
      return null;
    }
  }

  async getCoordinatesFromCity(cityName: string): Promise<L.LatLng | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&city=${encodeURIComponent(cityName)}&limit=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        return L.latLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des coordonnées de la ville:', error);
      return null;
    }
  }

  async extractCityFromAddress(address: string): Promise<string | null> {
    try {
      const coordinates = await this.geocodeAddress(address);
      if (!coordinates) return null;
      
      return await this.getCityName(coordinates);
    } catch (error) {
      console.error('Erreur lors de l\'extraction de la ville:', error);
      return null;
    }
  }
}