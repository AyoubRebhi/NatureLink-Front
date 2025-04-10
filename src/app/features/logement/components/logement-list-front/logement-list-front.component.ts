import { Component, OnInit } from '@angular/core';
import { LogementService } from 'src/app/core/services/logement.service';  // Import your service to fetch data
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-logement-list-front',
  templateUrl: './logement-list-front.component.html',
  styleUrls: ['./logement-list-front.component.scss']
})
export class LogementListFrontComponent implements OnInit {

  logements: any[] = [];  // Array to store fetched logements
  logImages: string[] = [
    'assets/img/log1.jpeg',  // Image 1
    'assets/img/log2.jpeg'   // Image 2
  ];

  constructor(private logementService: LogementService, private router: Router) { }

  ngOnInit(): void {
    this.loadLogements();  // Call the function to load logements on init
  }

  loadLogements(): void {
    this.logementService.getAllLogements().subscribe((data: any[]) => {
      this.logements = data.map((logement, index) => {
        // Add an image URL to each logement
        const image = this.logImages[index % this.logImages.length];  // Cycle through logImages
        return { ...logement, imageUrl: image };
      });
    });
  }

  // Optionally, you can create a method to navigate to a detail page
  viewMore(id: number): void {
    this.router.navigate(['/logement/detail', id]);  // Navigate to the detail page with the logement id
  }
}
