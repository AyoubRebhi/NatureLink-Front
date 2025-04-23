import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../core/services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { Payment } from '../../../../core/models/payment.model';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-user-payments',
  templateUrl: './user-payments.component.html',
  styleUrls: ['./user-payments.component.scss']
})
export class UserPaymentsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'amount', 'paymentMethod', 'status', 'paymentDate'];
  dataSource = new MatTableDataSource<Payment>();
  isLoading = true;
  errorMessage = '';
  userId!: number;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('userId')!;
    this.loadPayments();
  }

  private loadPayments(): void {
    this.paymentService.getPaymentsByUserId(this.userId).subscribe({
      next: (payments) => {
        this.dataSource.data = payments;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load payments';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}