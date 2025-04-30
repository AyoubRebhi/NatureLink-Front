import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent {
  isLogin = true;
  authForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AuthDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['']
    });

    if (!this.isLogin) {
      this.authForm.get('username')?.setValidators([Validators.required]);
    }
  }

  toggleForm(): void {
    this.isLogin = !this.isLogin;
    this.authForm.reset();
    this.errorMessage = null;
    
    if (!this.isLogin) {
      this.authForm.get('username')?.setValidators([Validators.required]);
    } else {
      this.authForm.get('username')?.clearValidators();
    }
    this.authForm.get('username')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;
    
    const formValue = this.authForm.value;
    const authObservable = this.isLogin 
      ? this.authService.signIn(formValue)
      : this.authService.signUp(formValue);

    authObservable.subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'An error occurred';
        this.isLoading = false;
      }
    });
  }
}