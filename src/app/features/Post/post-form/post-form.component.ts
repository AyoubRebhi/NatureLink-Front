import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { EmojiCategory, EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent {
  newPostContent = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;
  showEmojiPicker = false;
  
  @Output() postCreated = new EventEmitter<any>();
  @ViewChild('postTextarea') postTextarea!: ElementRef;

  constructor(
    private postService: PostService,
    private toastr: ToastrService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  createPost(): void {
    if (!this.newPostContent.trim() && !this.selectedFile) {
      this.toastr.warning('Veuillez ajouter du texte ou une image', 'Champs requis');
      return;
    }
  
    this.isSubmitting = true;
    const userId = 1; // À remplacer par l'ID utilisateur réel
  
    this.postService.createPost(
      this.newPostContent,
      this.selectedFile,
      userId
    ).pipe(
      finalize(() => {
        this.isSubmitting = false;
        this.showEmojiPicker = false;
      })
    ).subscribe({
      next: (response) => {
        this.postCreated.emit(response);
        this.clearForm();
        this.toastr.success('Votre publication a été créée avec succès', 'Succès');
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.toastr.error(
          'Une erreur est survenue lors de la création de votre publication',
          'Erreur',
          { timeOut: 3000 }
        );
      }
    });
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
    
    // Focus et position du curseur
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = cursorPosition + (event.emoji.native?.length || 0);
    });  }

  clearForm(): void {
    this.newPostContent = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.showEmojiPicker = false;
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
  


  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.toastr.info('Image supprimée', '', { timeOut: 2000 });
  }
}