// front-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PackService } from 'src/app/core/services/pack.service';
import { PackDTO } from 'src/app/core/models/pack.model';
import { RatingDTO } from 'src/app/core/models/rating.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-list',
  templateUrl: './pack-list-f.component.html',
  styleUrls: ['./pack-list-f.component.scss']
})
export class FrontListComponent implements OnInit {
  packs: PackDTO[] = [];
  showRatingModal: boolean = false;
  selectedPack: PackDTO | null = null;
  selectedRating: number = 0;
  userId?: number; // Set from AuthService
  loading: boolean = false;
  errorMessage: string | null = null;
  showChat: boolean = false;
  chatbotMessages: { role: 'user' | 'bot', text: string }[] = [];
  userMessage: string = '';
  selectedImagePack: PackDTO | null = null;
  generatedImageUrl: SafeUrl | null = null;
  showImagePopup: boolean = false;

  constructor(
    private packService: PackService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Set userId from AuthService
    this.userId = this.authService.getCurrentUserId() || undefined;
    if (!this.userId) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.fetchPacks();
  }

  fetchPacks(): void {
    this.loading = true;
    this.errorMessage = null;
    this.packService.getAllPacks().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.packs = data;
          this.packs.forEach(pack => {
            this.packService.getAverageRating(pack.id!).subscribe({
              next: (avgRating) => {
                pack.averageRating = avgRating;
              },
              error: (error: HttpErrorResponse) => {
                console.error(`Error fetching average rating for pack ${pack.id}:`, error);
                pack.averageRating = 0;
              }
            });
          });
        } else {
          this.errorMessage = 'Invalid pack data received';
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching packs:', error);
        this.errorMessage = 'Failed to load packs';
        this.loading = false;
      }
    });
  }

  getStarRating(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = new Array(fullStars).fill('★');
    if (hasHalfStar) stars.push('½');
    return stars.concat(new Array(emptyStars).fill('☆'));
  }

  openRatingModal(pack: PackDTO): void {
    this.selectedPack = pack;
    this.selectedRating = 0;
    this.showRatingModal = true;
    this.errorMessage = null;
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.selectedPack = null;
    this.selectedRating = 0;
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitRating(): void {
    if (!this.userId) {
      this.errorMessage = 'Please log in to submit a rating.';
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (!this.selectedPack || this.selectedRating <= 0 || this.selectedRating > 5) {
      this.errorMessage = 'Invalid rating or pack selection';
      return;
    }

    this.errorMessage = null;
    this.loading = true;

    const ratingData: RatingDTO = {
      packId: this.selectedPack.id!,
      ratingValue: this.selectedRating,
      userId: this.userId
    };

    this.packService.addRating(ratingData).subscribe({
      next: () => {
        this.packService.getAverageRating(this.selectedPack!.id!).subscribe({
          next: (avgRating) => {
            this.selectedPack!.averageRating = avgRating;
            this.loading = false;
            this.closeRatingModal();
          },
          error: () => {
            this.loading = false;
            this.errorMessage = 'Rating saved, but failed to refresh average';
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error submitting rating.';
      }
    });
  }

  ggenerateImageForPack(pack: PackDTO): void {
    this.selectedImagePack = pack;
    this.showImagePopup = true;
    this.generatedImageUrl = null;
    this.errorMessage = null;

    const prompt = `${pack.nom} - ${pack.description || ''}`;

    this.packService.generateImage(prompt).subscribe({
      next: (res) => {
        console.log('Generate Image Response:', res);
        setTimeout(() => {
          const imageUrl = `/static/${res.image_url}`;
          console.log('Generated Image URL:', imageUrl);
          this.generatedImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
          fetch(imageUrl)
            .then(response => {
              console.log('Image fetch status:', response.status, response.url);
              if (!response.ok) {
                throw new Error(`Image fetch failed: ${response.status}`);
              }
            })
            .catch(err => console.error('Image fetch error:', err));
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Generate Image Error:', error);
        this.generatedImageUrl = null;
        this.errorMessage = '❌ Failed to generate image';
      }
    });
  }

  onImageError(event: Event): void {
    console.error('Image load error:', event);
    this.errorMessage = 'Failed to load image. Please try again.';
  }

  closeImagePopup(): void {
    this.showImagePopup = false;
    this.selectedImagePack = null;
    this.generatedImageUrl = null;
    this.errorMessage = null;
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;
    const msg = this.userMessage;
    this.chatbotMessages.push({ role: 'user', text: msg });
    this.userMessage = '';
    this.scrollChatToBottom();

    this.packService.askChatbot(msg).subscribe({
      next: (res) => {
        this.chatbotMessages.push({ role: 'bot', text: res.response });
        this.scrollChatToBottom();
      },
      error: () => {
        this.chatbotMessages.push({ role: 'bot', text: '❌ Could not reach the chatbot.' });
        this.scrollChatToBottom();
      }
    });
  }

  private scrollChatToBottom(): void {
    setTimeout(() => {
      const el = document.querySelector('.chatbot-messages');
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Client-side error: ${error.error.message}`;
    }
    return error.message || 'Unexpected error occurred';
  }
}