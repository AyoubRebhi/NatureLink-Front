import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PackDTO, Pack } from '../../core/models/pack.model';
import { Observable } from 'rxjs';
import { RatingDTO } from 'src/app/core/models/rating.model';

@Injectable({
  providedIn: 'root',
})
export class PackService {
  private baseUrl = 'http://localhost:9000/api/packs';
  private chatbotUrl = 'http://localhost:5002/chat'; // Flask chatbot

  constructor(private http: HttpClient) {}

  // Existing pack methods
  addPack(pack: PackDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}`, pack);
  }

  updatePack(id: number, pack: PackDTO): Observable<Pack> {
    return this.http.put<Pack>(`${this.baseUrl}/update/${id}`, pack);
  }

  deletePack(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getAllPacks(): Observable<PackDTO[]> {
    return this.http.get<PackDTO[]>(`${this.baseUrl}`);
  }

  getPackById(id: number): Observable<Pack> {
    return this.http.get<Pack>(`${this.baseUrl}/${id}`);
  }

  getAverageRating(id: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${id}/average-rating`);
  }

  addRating(ratingDTO: RatingDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/ratings`, ratingDTO);
  }

  // 💬 Add chatbot integration here
  askChatbot(message: string): Observable<any> {
    return this.http.post<any>(this.chatbotUrl, { message });
  }
  generateImage(prompt: string) {
    return this.http.post<{ image_url: string }>('http://localhost:5003/generate-image', { prompt });
  }
  
  
}
