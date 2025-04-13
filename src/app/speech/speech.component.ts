import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.scss']
})
export class SpeechComponent implements OnInit {
  spokenText: string = '';
  recognition: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'fr-FR';
    this.recognition.interimResults = true;
    this.recognition.continuous = true;

    let finalTranscript = '';

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      this.spokenText = finalTranscript + interimTranscript;
      this.cdr.detectChanges();  // Force la détection des changements immédiatement
    };

    this.recognition.onerror = (event: any) => {
      console.error('Erreur :', event.error);
    };

    this.recognition.onend = () => {
      this.recognition.start(); // Redémarre l’écoute automatiquement si ça coupe
    };

    this.recognition.start();
  }
}
