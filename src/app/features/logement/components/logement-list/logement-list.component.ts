import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-logement-list',
  templateUrl: './logement-list.component.html',
  styleUrls: ['./logement-list.component.scss']
})
export class LogementListComponent implements OnInit {

  logements: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLogements();
  }

  loadLogements() {
    this.http.get('http://localhost:8080/api/logements')
      .pipe(
        catchError((error) => {
          console.error('Error fetching logements:', error);
          return of([]);  // Return an empty array on error
        })
      )
      .subscribe((data: any) => {
        this.logements = data;
      });
  }
}
