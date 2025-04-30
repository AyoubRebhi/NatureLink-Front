import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, of } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service'; // adjust the path if needed
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-logement-list',
  templateUrl: './logement-list.component.html',
  styleUrls: ['./logement-list.component.scss']
})
export class LogementListComponent implements OnInit {
  logements: any[] = [];
  users: User[] = [];

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    this.loadLogementsAndUsers();
  }

  loadLogementsAndUsers() {
    forkJoin({
      logements: this.http.get<any[]>('http://localhost:9000/logements').pipe(catchError(err => {
        console.error('Error fetching logements:', err);
        return of([]);
      })),
      users: this.userService.getAllUsers().pipe(catchError(err => {
        console.error('Error fetching users:', err);
        return of([]);
      }))
    }).subscribe(({ logements, users }) => {
      this.logements = logements;
      this.users = users;
    });
  }

  getUserNameById(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.username}` : 'Unknown';
  }

  deleteLogement(id: number) {
    if (confirm('Are you sure you want to delete this logement?')) {
      this.http.delete(`http://localhost:9000/logements/${id}`).subscribe(() => {
        this.logements = this.logements.filter(l => l.id !== id);
      }, error => {
        console.error('Error deleting logement:', error);
      });
    }
  }
}
