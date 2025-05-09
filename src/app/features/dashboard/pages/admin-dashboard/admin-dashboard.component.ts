import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { PendingUser } from '../../../../core/models/pending-user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  usersDataSource = new MatTableDataSource<User>([]);
  pendingUsersDataSource = new MatTableDataSource<PendingUser>([]);
  isLoading = true;
  errorMessage = '';
  
  // Columns for active users table
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'status', 'actions'];
  
  // Columns for pending users table
  pendingDisplayedColumns: string[] = ['id', 'username', 'email', 'role', 'proofDocument', 'actions'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.usersDataSource.paginator = this.paginator;
    this.usersDataSource.sort = this.sort;
  }

  private loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load active users
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.usersDataSource.data = users;
        this.loadPendingUsers();
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private loadPendingUsers(): void {
    this.userService.getPendingUsers().subscribe({
      next: (pendingUsers) => {
        this.pendingUsersDataSource.data = pendingUsers;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private handleError(err: any): void {
    console.error('Error:', err);
    this.isLoading = false;
    
    if (err.status === 403) {
      this.errorMessage = 'Admin privileges required';
      setTimeout(() => this.router.navigate(['/']), 2000);
    } else if (err.status === 0) {
      this.errorMessage = 'Server unavailable';
    } else {
      this.errorMessage = err.message || 'Failed to load data';
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

  approveUser(pendingUser: PendingUser): void {
    this.userService.approveUser(pendingUser.id).subscribe({
      next: (approvedUser) => {
        this.removePendingUser(pendingUser.id);
        this.usersDataSource.data = [...this.usersDataSource.data, approvedUser];
      },
      error: (err) => {
        console.error('Approval failed:', err);
        this.errorMessage = 'Failed to approve user';
        this.cdr.detectChanges();
      }
    });
  }

  rejectUser(pendingUser: PendingUser): void {
    this.userService.rejectUser(pendingUser.id).subscribe({
      next: () => {
        this.removePendingUser(pendingUser.id);
      },
      error: (err) => {
        console.error('Rejection failed:', err);
        this.errorMessage = 'Failed to reject user';
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
    }
  }

  private removePendingUser(id: number): void {
    this.pendingUsersDataSource.data = this.pendingUsersDataSource.data.filter(u => u.id !== id);
  }

  viewUserPayments(user: User): void {
    this.router.navigate([`/admin/users/${user.id}/payments`]);
  }

  viewProofDocument(documentUrl: string): void {
    window.open(documentUrl, '_blank');
  }

  applyFilter(event: Event, dataSource: MatTableDataSource<any>): void {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }
}