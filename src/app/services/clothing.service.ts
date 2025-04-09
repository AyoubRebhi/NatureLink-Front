import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clothing } from '../model/Clothing.model';

@Injectable({
  providedIn: 'root'
})
export class ClothingService {
  private apiUrl = 'http://localhost:9000/api/clothing';

  constructor(private http: HttpClient) { }

  getAllClothingItems(): Observable<Clothing[]> {
    return this.http.get<Clothing[]>(this.apiUrl);
  }

  getClothingByDestination(destinationId: number): Observable<Clothing[]> {
    return this.http.get<Clothing[]>(`${this.apiUrl}/destination/${destinationId}`);
  }
  getClothingById(id: number): Observable<Clothing> {
    return this.http.get<Clothing>(`${this.apiUrl}/${id}`);
  }
  
  updateClothing(id: number, formData: FormData): Observable<Clothing> {
    return this.http.put<Clothing>(`${this.apiUrl}/${id}`, formData);
  }

  addClothingWithImage(
    name: string,
    description: string,
    season: string,
    destinationId: number,
    image: File | null
  ): Observable<Clothing> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('season', season);
    formData.append('destinationId', destinationId.toString());
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<Clothing>(this.apiUrl, formData);
  }

  addClothing(clothing: Clothing): Observable<Clothing> {
    return this.http.post<Clothing>(`${this.apiUrl}/json`, clothing);
  }
  // Add this method to your ClothingService
deleteClothing(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
}