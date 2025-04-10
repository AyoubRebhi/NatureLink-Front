import { Component } from '@angular/core';
import { LogementService } from 'src/app/core/services/logement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logement-create',
  templateUrl: './logement-create.component.html',
  styleUrls: ['./logement-create.component.scss']
})
export class LogementCreateComponent {
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

  // Method to handle form submission
  onSubmit() {
    const formData = {
      ...this.logement
    };

    this.logementService.addLogement(formData).subscribe(
      response => {
        alert('Logement added successfully!');
        this.router.navigate(['/admin/logement/list']); // Navigate to the logements list
      },
      error => {
        console.error('Error adding logement:', error);
        alert('Failed to add logement');
      }
    );
  }
}
