import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FaqChatbotService {

  private apiUrl = 'http://localhost:5020/chat'; // Your Flask FAQ chatbot endpoint

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { message });
  }
}
