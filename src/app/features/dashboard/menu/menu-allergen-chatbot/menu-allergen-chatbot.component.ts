import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu } from 'src/app/core/models/menu';

@Component({
  selector: 'app-menu-allergen-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-allergen-chatbot.component.html',
  styleUrls: ['./menu-allergen-chatbot.component.scss']
})
export class MenuAllergenChatbotComponent {
  @Input() restaurantId!: number;
  @Output() filteredMenus = new EventEmitter<Menu[]>();
  question: string = '';
  response: string | null = null;
  error: string | null = null;
  isLoading: boolean = false;

  constructor(private http: HttpClient, private menuService: MenuService) {}

  submitQuestion() {
    if (!this.question.trim()) {
      this.error = 'Veuillez saisir une question.';
      return;
    }

    if (!this.restaurantId || this.restaurantId <= 0) {
      this.error = 'ID de restaurant invalide.';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.response = null;

    const payload = {
      restaurantId: this.restaurantId.toString(),
      question: this.question
    };

    this.http.post<{ response: string }>('http://backend/picloud/api/menus/chatbot', payload)
      .subscribe({
        next: (res) => {
          this.response = res.response;
          this.question = '';
          this.isLoading = false;

          // Extract allergen from question for filtering
          const allergen = this.extractAllergenFromQuestion(this.question);
          if (allergen) {
            this.menuService.filterMenusByAllergen(this.restaurantId, allergen).subscribe({
              next: (filteredMenus) => {
                this.filteredMenus.emit(filteredMenus);
              },
              error: (err) => {
                console.error('Erreur lors du filtrage des menus:', err);
                this.error = 'Erreur lors du filtrage des menus.';
              }
            });
          }
        },
        error: (err) => {
          this.error = 'Erreur lors de la communication avec le chatbot. Veuillez réessayer.';
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  private extractAllergenFromQuestion(question: string): string | null {
    const allergens = ['gluten', 'lait', 'oeuf', 'arachide', 'soja', 'noix', 'poisson', 'crustacé'];
    const lowerQuestion = question.toLowerCase();
    return allergens.find(allergen => lowerQuestion.includes(allergen)) || null;
  }
}
