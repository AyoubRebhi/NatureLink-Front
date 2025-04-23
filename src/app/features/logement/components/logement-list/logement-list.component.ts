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
    this.http.get('http://localhost:9000/logements')
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
  deleteLogement(id: number) {
    if (confirm('Are you sure you want to delete this logement?')) {
      this.http.delete(`http://localhost:9000/logements/${id}`)
        .subscribe(() => {
          this.logements = this.logements.filter(l => l.id !== id);
        }, error => {
          console.error('Error deleting logement:', error);
        });
    }
  }
  
}
