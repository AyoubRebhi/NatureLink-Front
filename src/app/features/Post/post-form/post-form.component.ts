import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../../core/services/post.service';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnDestroy {
  private readonly SIGHTENGINE_CONFIG = {
    API_USER: '1700834085',
    API_SECRET: 'VTZQVtFnApBD3R6atXbr4AoYqb6dPczf',
    TEXT_API_URL: 'https://api.sightengine.com/1.0/text/check.json',
    IMAGE_API_URL: 'https://api.sightengine.com/1.0/check.json',
    MODELS: 'nudity-2.0,wad,offensive'
  };

  newPostContent = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;
  showEmojiPicker = false;
  isListening = false;
  recognition: any;
  
  @Output() postCreated = new EventEmitter<any>();
  @ViewChild('postTextarea') postTextarea!: ElementRef;

  constructor(
    private postService: PostService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initSpeechRecognition();
  }

  ngOnDestroy(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  private validateText(text: string): Observable<any> {
    if (!text?.trim()) {
      return of({ status: 'success' });
    }

    const params = new HttpParams()
      .set('api_user', this.SIGHTENGINE_CONFIG.API_USER)
      .set('api_secret', this.SIGHTENGINE_CONFIG.API_SECRET)
      .set('text', encodeURIComponent(text))
      .set('mode', 'standard')
      .set('lang', 'en')
      .set('models','general');

    return this.http.get(this.SIGHTENGINE_CONFIG.TEXT_API_URL, { params }).pipe(
      catchError(err => {
        console.error('API Error:', err);
        this.analyzeSightengineError(err);
        return of({ status: 'failure', error: err });
      })
    );
  }

  private isTextInappropriate(result: any): boolean {
    if (!result || result.status !== 'success') {
      return false;
    }

    // Vérifie explicitement les matches de profanité
    if (result.profanity?.matches?.length > 0) {
      return true;
    }

    // Vérifie les scores globaux
    const thresholds = {
      profanity: 0.5,
      sexual: 0.5,
      drugs: 0.5,
      insult: 0.7,
      discrimination: 0.7,
      violent: 0.2
    };

    return (
      (result.profanity?.score > thresholds.profanity) ||
      (result.sexual?.score > thresholds.sexual) ||
      (result.drugs?.score > thresholds.drugs) ||
      (result.insult?.score > thresholds.insult) ||
      (result.discrimination?.score > thresholds.discrimination)||
      (result.violent?.score > thresholds.violent)

    );
  }

  createPost(): void {
    if (!this.newPostContent.trim() && !this.selectedFile) {
      this.toastr.warning('Contenu requis');
      return;
    }

    this.isSubmitting = true;

    this.validateText(this.newPostContent).pipe(
      switchMap(textResult => {
        if (this.isTextInappropriate(textResult)) {
          this.isSubmitting = false;
          this.toastr.error('Contenu inapproprié détecté');
          return throwError(() => new Error('Contenu inapproprié'));
        }

        const userId = 1; // À remplacer par l'ID réel
        return this.postService.createPost(this.newPostContent, this.selectedFile, userId);
      }),
      finalize(() => {
        this.isSubmitting = false;
        this.showEmojiPicker = false;
      })
    ).subscribe({
      next: (response) => this.handlePostSuccess(response),
      error: (err) => {
        if (err.message !== 'Contenu inapproprié') {
          this.handlePostError(err);
        }
      }
    });
  }

  // ... [Le reste des méthodes reste inchangé] ...
  private initSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                            (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Reconnaissance vocale non supportée');
      this.toastr.warning('Fonctionnalité non disponible');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'fr-FR';

    this.recognition.onresult = (event: any) => this.handleSpeechResult(event);
    this.recognition.onerror = (event: any) => this.handleSpeechError(event);
    this.recognition.onend = () => this.isListening = false;
  }

  private handleSpeechResult(event: any): void {
    const transcript = event.results[0][0].transcript;
    const textarea = this.postTextarea.nativeElement;
    const cursorPosition = textarea.selectionStart;
    
    this.newPostContent = 
      this.newPostContent.substring(0, cursorPosition) + 
      transcript + 
      this.newPostContent.substring(cursorPosition);
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = cursorPosition + transcript.length;
      textarea.focus();
    });
  }

  private handleSpeechError(event: any): void {
    console.error('Erreur reconnaissance:', event.error);
    this.isListening = false;
    this.toastr.error('Erreur de reconnaissance vocale');
  }

  toggleVoiceRecognition(): void {
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.toastr.info('Reconnaissance arrêtée', '', { timeOut: 2000 });
    } else {
      this.startVoiceRecognition();
    }
  }

  private startVoiceRecognition(): void {
    try {
      this.recognition.start();
      this.isListening = true;
      this.toastr.info('Parlez maintenant...', 'Écoute', { timeOut: 3000 });
    } catch (e) {
      console.error('Erreur démarrage:', e);
      this.isListening = false;
      this.toastr.error('Démarrage impossible');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.validateFile(file)) return;

    this.validateImage(file).subscribe({
      next: (result) => this.handleValidationResult(file, result),
      error: (err) => this.handleValidationError(err)
    });
  }

  private validateFile(file: File): boolean {
    if (!file.type.startsWith('image/')) {
      this.toastr.error('Format image invalide');
      this.resetFileInput();
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastr.error('Taille maximale 5MB');
      this.resetFileInput();
      return false;
    }

    return true;
  }

  private validateImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('media', file);

    const params = new HttpParams()
      .set('api_user', this.SIGHTENGINE_CONFIG.API_USER)
      .set('api_secret', this.SIGHTENGINE_CONFIG.API_SECRET)
      .set('models', this.SIGHTENGINE_CONFIG.MODELS);

    return this.http.post(this.SIGHTENGINE_CONFIG.IMAGE_API_URL, formData, { params });
  }

  private handleValidationResult(file: File, result: any): void {
    if (this.isImageInvalid(result)) {
      this.toastr.error('Contenu inapproprié détecté');
      this.resetFileInput();
      return;
    }

    this.selectedFile = file;
    this.previewImage(file);
  }

  private isImageInvalid(result: any): boolean {
    const thresholds = {
      nudity: 0.3,
      weapon: 0.5,
      offensive: 0.5,
      gore: 0.3,
      drugs: 0.5,
      alcohol: 0.5,
      tobacco: 0.5,
      scam: 0.7
    };

    return (
      result.nudity?.raw > thresholds.nudity ||
      result.nudity?.partial > thresholds.nudity ||
      result.weapon > thresholds.weapon ||
      result.offensive?.prob > thresholds.offensive ||
      result.gore > thresholds.gore ||
      result.drugs > thresholds.drugs ||
      result.alcohol > thresholds.alcohol ||
      result.tobacco > thresholds.tobacco ||
      result.scam > thresholds.scam
    );
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  private handleValidationError(err: any): void {
    console.error('Erreur validation:', err);
    this.toastr.error('Erreur de validation');
    this.resetFileInput();
  }

  private handlePostSuccess(response: any): void {
    this.postCreated.emit(response);
    this.clearForm();
    this.toastr.success('Publication réussie');
  }

  private handlePostError(err: any): void {
    console.error('Erreur publication:', err);
    this.toastr.error('Échec de la publication');
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: EmojiEvent): void {
    const textarea = this.postTextarea.nativeElement;
    const cursorPosition = textarea.selectionStart;
    
    this.newPostContent = 
      this.newPostContent.substring(0, cursorPosition) + 
      event.emoji.native + 
      this.newPostContent.substring(cursorPosition);
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = cursorPosition + (event.emoji.native?.length || 0);
    });
  }

  clearForm(): void {
    this.newPostContent = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.showEmojiPicker = false;
    this.resetFileInput();
  }

  private resetFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.toastr.info('Image supprimée');
  }

  private analyzeSightengineError(err: any): void {
    try {
      const errorDetails = err.error;
      console.group('Analyse erreur Sightengine');
      console.log('Status:', err.status);
      console.log('Message:', errorDetails?.message || 'Pas de message');
      console.log('Code erreur:', errorDetails?.code || 'Inconnu');
      console.groupEnd();
    } catch (e) {
      console.error('Erreur analyse:', e);
    }
  }

  emojiConfig = {
    perLine: 7,
    showPreview: false,
    emojiSize: 22,
    categories: [
      'recent',
      'people',
      'nature',
      'foods',
      'activity',
      'objects',
      'symbols'
    ]
  };
}