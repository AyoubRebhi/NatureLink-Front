import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PackService } from 'src/app/core/services/pack.service';
import { PackDTO } from 'src/app/core/models/pack.model';
import { RatingDTO } from 'src/app/core/models/rating.model';

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
  userId: number = 4;
  loading: boolean = false;
  errorMessage: string | null = null;

  // 💬 Chatbot
  showChat: boolean = false;
  chatbotMessages: { role: 'user' | 'bot', text: string }[] = [];
  userMessage: string = '';

  constructor(private packService: PackService) {}

  ngOnInit(): void {
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
                this.errorMessage = `Failed to load rating for pack ${pack.nom || pack.id}`;
              }
            });
          });
        } else {
          console.error('Unexpected data format:', data);
          this.errorMessage = 'Invalid pack data received';
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching packs:', error);
        this.errorMessage = this.getErrorMessage(error) || 'Failed to load packs. Please try again later.';
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
    if (!this.selectedPack) {
      this.errorMessage = 'No pack selected';
      return;
    }
  
    if (this.selectedRating <= 0 || this.selectedRating > 5) {
      this.errorMessage = 'Please select a rating between 1 and 5 stars';
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
          error: (error: HttpErrorResponse) => {
            console.error('Error fetching updated rating:', error);
            this.loading = false;
            this.errorMessage = 'Rating submitted but failed to update display';
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error submitting rating:', error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to submit rating.';
      }
    });
  }

  // 💬 Chatbot interaction
  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    const msg = this.userMessage;
    this.chatbotMessages.push({ role: 'user', text: msg });
    this.userMessage = '';

    this.packService.askChatbot(msg).subscribe({
      next: (res) => {
        this.chatbotMessages.push({ role: 'bot', text: res.response });
      },
      error: () => {
        this.chatbotMessages.push({ role: 'bot', text: '❌ Could not reach the chatbot.' });
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `An error occurred: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        return 'Network error: Please check your internet connection';
      } else if (error.status === 400) {
        return error.error?.message || 'Invalid request data';
      } else if (error.status === 401) {
        return 'Authentication required';
      } else if (error.status === 403) {
        return 'You are not authorized to perform this action';
      } else if (error.status === 404) {
        return 'Resource not found';
      } else if (error.status >= 500) {
        return 'Server error: Please try again later';
      }
      return error.message || 'An unknown error occurred';
    }
  }
}
