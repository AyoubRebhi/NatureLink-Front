// payment.model.ts
import { User } from './user.model';
export interface Payment {
    id: number;
    amount: number;
    paymentMethod: string;
    paymentDate: Date;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    userId?: number; // Assuming you have a User model
  }