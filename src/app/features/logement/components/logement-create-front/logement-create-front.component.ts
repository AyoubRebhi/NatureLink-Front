import { Component } from '@angular/core';
import { LogementService } from 'src/app/core/services/logement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logement-create-front',
  templateUrl: './logement-create-front.component.html',
  styleUrls: ['./logement-create-front.component.scss']
})
export class LogementCreateFrontComponent {
  logement: any = {
    titre: '',
    description: '',
    location: '',
    price: 0,
    image: '',
    phone: '',
    email: '',
    socialMedia: ''
  };

  constructor(private logementService: LogementService, private router: Router) {}

  // Handle form submission
  onSubmit() {
    const formData = { ...this.logement };

    this.logementService.addLogement(formData).subscribe(
      (response) => {
        alert('Logement added successfully!');
        this.router.navigate(['/logementsFront']); // Navigate back to logement list
      },
      (error) => {
        console.error('Error adding logement:', error);
        alert('Failed to add logement');
      }
    );
  }
}
