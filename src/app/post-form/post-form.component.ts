import { Component, EventEmitter, Output } from '@angular/core';
import { PostService } from '../services/post.service';
import { HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

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
  
  @Output() postCreated = new EventEmitter<any>();

  constructor(private postService: PostService) {}

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
    if (!this.newPostContent.trim() && !this.selectedFile) return;
  
    this.isSubmitting = true;
    const userId = 1; // À remplacer par l'ID utilisateur réel
  
    this.postService.createPost(
      this.newPostContent,
      this.selectedFile,
      userId
    ).pipe(
      finalize(() => {
        this.isSubmitting = false; // S'exécute dans tous les cas
      })
    ).subscribe({
      next: (response) => {
        this.postCreated.emit(response);
        this.clearForm(); // Vide le formulaire après succès
      },
      error: (err) => {
        console.error('Erreur:', err);
        // Ne pas vider le formulaire en cas d'erreur
      }
    });
  }

  clearForm(): void {
    // Réinitialisation complète
    this.newPostContent = '';
    this.selectedFile = null;
    this.imagePreview = null;
    
    // Réinitialise aussi l'input file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }
}