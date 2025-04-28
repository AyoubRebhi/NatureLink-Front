import { Injectable } from '@angular/core';
import axios from 'axios';
import MicrophoneStream from 'microphone-stream';

@Injectable({
  providedIn: 'root'
})
export class AssemblyAiService {
  private readonly API_KEY = 'e99b46f6e78d45a5a7cf8188296b3c71'; // À sécuriser dans environment.ts
  private readonly BASE_URL = 'https://api.assemblyai.com/v2';
  
  private microphoneStream!: MicrophoneStream;
  private audioContext!: AudioContext;
  private socket!: WebSocket;
  private isRecording = false;

  constructor() { }

  async startRecording(onTranscript: (text: string, isFinal: boolean) => void) {
    try {
      // Initialiser le flux microphone
      this.microphoneStream = new MicrophoneStream();
      
      // Démarrer le contexte audio
      this.audioContext = new AudioContext();
      await this.audioContext.resume(); // Important pour iOS
      
      // Obtenir l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });
      
      this.microphoneStream.setStream(stream);
      this.isRecording = true;
      
      // Configurer AssemblyAI
      await this.setupAssemblyAI(onTranscript);
      
    } catch (error) {
      console.error('Erreur démarrage enregistrement:', error);
      this.cleanup();
      throw error;
    }
  }

  stopRecording() {
    this.isRecording = false;
    this.cleanup();
  }

  private async setupAssemblyAI(onTranscript: (text: string, isFinal: boolean) => void) {
    try {
      // 1. Obtenir un token temporaire
      const tokenResponse = await axios.post(
        `${this.BASE_URL}/realtime/token`,
        { expires_in: 3600 },
        { headers: { authorization: this.API_KEY } }
      );

      // 2. Ouvrir la connexion WebSocket
      this.socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?token=${tokenResponse.data.token}`);

      this.socket.onopen = () => {
        console.log('Connexion AssemblyAI établie');
        this.streamAudioToSocket();
      };

      this.socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.message_type === 'PartialTranscript') {
          onTranscript(data.text, false);
        } else if (data.message_type === 'FinalTranscript') {
          onTranscript(data.text, true);
        }
      };

      this.socket.onclose = () => console.log('Connexion AssemblyAI fermée');
      this.socket.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        this.cleanup();
      };

    } catch (error) {
      console.error('Erreur configuration AssemblyAI:', error);
      this.cleanup();
      throw error;
    }
  }

  private streamAudioToSocket() {
    this.microphoneStream.on('data', (chunk: Buffer) => {
      if (this.socket.readyState === WebSocket.OPEN) {
        const audioData = new Int16Array(
          chunk.buffer,
          chunk.byteOffset,
          chunk.length / 2
        );
        this.socket.send(JSON.stringify({
          audio_data: Array.from(audioData)
        }));
      }
    });
  }

  private cleanup() {
    if (this.microphoneStream) {
      this.microphoneStream.stop();
      this.microphoneStream.destroy();
    }
    
    if (this.socket) {
      this.socket.close();
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}