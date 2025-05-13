import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PackDTO, Pack } from '../../core/models/pack.model';
import { Observable } from 'rxjs';
import { RatingDTO } from 'src/app/core/models/rating.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PackService {
  public apiUrl = `${environment.apiBaseUrl}/packs`;

  private chatbotUrl = 'http://localhost:5002/chat'; // Flask chatbot

  constructor(private http: HttpClient) {}

  // Existing pack methods
  addPack(pack: PackDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}`, pack);
  }

  updatePack(id: number, pack: PackDTO): Observable<Pack> {
    return this.http.put<Pack>(`${this.apiUrl}/update/${id}`, pack);
  }

  deletePack(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getAllPacks(): Observable<PackDTO[]> {
    return this.http.get<PackDTO[]>(`${this.apiUrl}`);
  }

  getPackById(id: number): Observable<Pack> {
    return this.http.get<Pack>(`${this.apiUrl}/${id}`);
  }

  getAverageRating(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/average-rating`);
  }

  addRating(ratingDTO: RatingDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/ratings`, ratingDTO);
  }

  // 💬 Add chatbot integration here
  askChatbot(message: string): Observable<any> {
    return this.http.post<any>(this.chatbotUrl, { message });
  }
  generateImage(prompt: string) {
    return this.http.post<{ image_url: string }>('http://localhost:5003/generate-image', { prompt });
  }
  
  
}
