// payments.component.ts
import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Payment } from '../../../core/models/payment.model';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  newPayment: { amount?: number, paymentMethod?: string } = {}; // Explicit type
  showCreateForm = false;
   // Add missing properties
   validationError = '';
   successMessage = '';
   processing = false;
   submitted = false;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.paymentService.getPayments().subscribe(payments => {
      this.payments = payments;
    });
  }
  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    this.submitted = false;
    this.validationError = '';
    this.successMessage = '';
  }
  createPayment() {
    // Validate inputs
    if (!this.newPayment.amount || !this.newPayment.paymentMethod) {
      this.validationError = 'Amount and payment method are required';
      return;
    }
    
    // Clear previous errors
    this.validationError = '';

    // Create type-safe payment object
    const paymentData = {
      amount: this.newPayment.amount,
      paymentMethod: this.newPayment.paymentMethod
    };

    this.paymentService.createPayment(paymentData).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.newPayment = {};
        this.loadPayments();
      },
      error: (err) => {
        this.validationError = 'Failed to create payment. Please try again.';
        console.error(err);
      }
    });
  }
}