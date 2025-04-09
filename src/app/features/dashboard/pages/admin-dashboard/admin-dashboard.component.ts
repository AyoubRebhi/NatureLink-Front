import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  usersDataSource = new MatTableDataSource<User>([]);
  isAdmin = false;
  isLoading = true;
  errorMessage = '';
  //displayedColumns: string[] = ['id', 'username', 'email', 'role', 'actions'];
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'status', 'actions'];
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('AdminDashboardComponent initialized');
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('API Response:', users);
        this.usersDataSource.data = users;  // Ensure you assign data to the MatTableDataSource
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.handleError(err);
        this.isLoading = false;
      }
    });
  }

  private handleError(err: any): void {
    console.error('Error details:', err);
    
    if (err.status === 403) {
      this.errorMessage = 'Admin privileges required';
      setTimeout(() => this.router.navigate(['/']), 2000);
    } else if (err.status === 0) {
      this.errorMessage = 'Server unavailable';
    } else {
      this.errorMessage = 'Failed to load users';
    }
  }
  // admin-dashboard.component.ts
blockUser(user: User) {
  this.userService.blockUser(user.id).subscribe({
    next: (updatedUser) => {
      this.updateUserInList(updatedUser);
    },
    error: (err) => {
      console.error('Block failed:', err);
      this.errorMessage = 'Failed to block user';
    }
  });
}

unblockUser(user: User) {
  this.userService.unblockUser(user.id).subscribe({
    next: (updatedUser) => {
      this.updateUserInList(updatedUser);
    },
    error: (err) => {
      console.error('Unblock failed:', err);
      this.errorMessage = 'Failed to unblock user';
    }
  });
}

private updateUserInList(updatedUser: User) {
  const index = this.usersDataSource.data.findIndex(u => u.id === updatedUser.id);
  if (index > -1) {
    const newData = [...this.usersDataSource.data];
    newData[index] = updatedUser;
    this.usersDataSource.data = newData;
  }
}
}
