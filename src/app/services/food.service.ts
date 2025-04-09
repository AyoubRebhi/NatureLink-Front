import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Food } from '../model/Food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = 'http://localhost:9000/api/foods';

  constructor(private http: HttpClient) { }

  getAllFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(this.apiUrl);
  }

  getFoodById(id: number): Observable<Food> {
    return this.http.get<Food>(`${this.apiUrl}/${id}`);
  }

  getFoodsByDestination(destinationId: number): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiUrl}/byDestination/${destinationId}`);
  }

  addFoodWithImage(
    name: string,
    description: string,
    season: string,
    destinationId: number,
    image: File | null
  ): Observable<Food> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('season', season);
    formData.append('destinationId', destinationId.toString());
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<Food>(this.apiUrl, formData);
  }

  deleteFood(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  updateFoodWithImage(
    id: number,
    name: string,
    description: string,
    season: string,
    destinationId: number,
    image: File | null
  ): Observable<Food> {
    const formData = new FormData();
    formData.append('nom', name); // Notez 'nom' au lieu de 'name'
    formData.append('description', description);
    formData.append('season', season);
    formData.append('destinationId', destinationId.toString());
    if (image) {
      formData.append('file', image); // Notez 'file' au lieu de 'image'
    }
  
    return this.http.put<Food>(`${this.apiUrl}/${id}`, formData);
  }

}