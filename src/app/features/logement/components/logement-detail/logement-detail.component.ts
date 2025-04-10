import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogementService } from 'src/app/core/services/logement.service';
import { Logement } from 'src/app/core/models/logement.model';

@Component({
  selector: 'app-logement-detail',
  templateUrl: './logement-detail.component.html',
  styleUrls: ['./logement-detail.component.scss']
})
export class LogementDetailComponent implements OnInit {
  logement: Logement | null = null;

  constructor(
    private route: ActivatedRoute,
    private logementService: LogementService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;  // Get the ID from the route params
    this.logementService.getLogementById(id).subscribe((data) => {
      this.logement = data;  // Set the logement details
    });
  }
}
