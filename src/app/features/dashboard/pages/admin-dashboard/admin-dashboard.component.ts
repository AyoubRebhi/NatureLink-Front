import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { PendingUser } from '../../../../core/models/pending-user.model';
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
  pendingUsersDataSource = new MatTableDataSource<PendingUser>([]);
  isLoading = true;
  errorMessage = '';
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'status', 'actions'];
  pendingDisplayedColumns: string[] = ['id', 'username', 'email', 'role', 'proofDocument', 'actions'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('AdminDashboardComponent initialized');
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load active users
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Active Users:', users);
        this.usersDataSource.data = users;
       
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
      this.errorMessage = 'Failed to load data';
    }
    this.cdr.detectChanges();
  }

  blockUser(user: User): void {
    this.userService.blockUser(user.id).subscribe({
      next: (updatedUser) => {
        this.updateUserInList(updatedUser);
      },
      error: (err) => {
        console.error('Block failed:', err);
        this.errorMessage = 'Failed to block user';
        this.cdr.detectChanges();
      }
    });
  }

  unblockUser(user: User): void {
    this.userService.unblockUser(user.id).subscribe({
      next: (updatedUser) => {
        this.updateUserInList(updatedUser);
      },
      error: (err) => {
        console.error('Unblock failed:', err);
        this.errorMessage = 'Failed to unblock user';
        this.cdr.detectChanges();
      }
    });
  }

  

 

  private updateUserInList(updatedUser: User): void {
    const index = this.usersDataSource.data.findIndex(u => u.id === updatedUser.id);
    if (index > -1) {
      const newData = [...this.usersDataSource.data];
      newData[index] = updatedUser;
      this.usersDataSource.data = newData;
      this.cdr.detectChanges();
    }
  }

  viewUserPayments(user: User): void {
    this.router.navigate([`/admin/users/${user.id}/payments`]);
  }
}