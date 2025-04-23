import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthResponse } from '../../core/models/auth-response';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  roles = ['USER', 'AGENCE', 'MONUMENT', 'PROVIDER'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      proofDocument: ['']
    });

    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      const proofDocumentControl = this.registerForm.get('proofDocument');
      if (role !== 'USER') {
        proofDocumentControl?.setValidators([Validators.required]);
      } else {
        proofDocumentControl?.clearValidators();
      }
      proofDocumentControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Please fix validation errors';
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role,
      proofDocument: this.registerForm.value.proofDocument
    };

    this.authService.signUp(formData).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        if (response.message === 'Registration request submitted for approval') {
          alert('Your registration is pending admin approval.');
          this.router.navigate(['/auth/login']);
        } else if (response.token) {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
        console.error('Registration error:', err);
      }
    });
  }

  private getErrorMessage(err: any): string {
    console.error('Full error object:', err);

    const serverMessage = err?.error?.error?.message ||
                         err?.error?.message ||
                         err?.message ||
                         err?.error?.error ||
                         err?.error;

    const duplicatePatterns = [
      'already exist',
      'duplicate',
      'already in use',
      'email must be unique'
    ];

    if (duplicatePatterns.some(pattern => serverMessage?.toLowerCase().includes(pattern))) {
      return 'Email or username already registered';
    }

    switch (err.status) {
      case 409: return 'Email or username already exists';
      case 400: return serverMessage || 'Invalid registration data';
      case 0: return 'Network connection failed';
      case 500: return 'Server error. Please try later';
    }

    return serverMessage || 'Registration failed. Please check your details';
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get role() { return this.registerForm.get('role'); }
  get proofDocument() { return this.registerForm.get('proofDocument'); }
}