// src/app/core/services/websocket.service.ts
import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { Logement } from '../models/logement.model';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private logementSubject = new Subject<Logement>();

  constructor() {
    this.client = new Client({
      brokerURL: environment.websocketUrl || undefined,
      webSocketFactory: () => new SockJS(environment.websocketEndpoint),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/logements', (message: Message) => {
        const logement: Logement = JSON.parse(message.body);
        this.logementSubject.next(logement);
      });
    };

    this.client.activate();
  }

  onNewLogement(): Observable<Logement> {
    return this.logementSubject.asObservable();
  }
}
