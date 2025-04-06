import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

 // login.component.ts
onSubmit() {
  if (this.loginForm.invalid) return;

  this.isLoading = true;
  this.errorMessage = '';
  
  const credentials = this.loginForm.value as { email: string; password: string };

  this.authService.signIn(credentials).subscribe({
    next: () => {
      this.isLoading = false;
      // Add explicit navigation
    },
    error: (err) => {
      this.errorMessage = this.parseErrorMessage(err);
      this.isLoading = false;
      console.error('Login error:', err);  // Add detailed logging
    }
  });
}

  // login.component.ts
// Update parseErrorMessage method
private parseErrorMessage(error: any): string {
  console.error('Full login error:', error);
  
  // Handle nested errors
  const serverMessage = error?.error?.error || 
                       error?.error?.message || 
                       error?.message;

  if (serverMessage?.toLowerCase().includes('invalid credentials')) {
    return 'Invalid email or password';
  }

  switch (error.status) {
    case 401: return 'Invalid login credentials';
    case 403: return 'Invalid credentials';
    case 0: return 'Network connection failed';
    case 500: return 'Server error. Please try later';
  }

  return 'Login failed. Please try again';
}
}