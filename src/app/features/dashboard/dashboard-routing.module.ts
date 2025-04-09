import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Role } from '../../core/models/user.model';
import { PaymentsComponent } from '../../pages/payments/payments/payments.component';
import { UserPaymentsComponent } from './pages/user-payments/user-payments.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] },
    children: [
      { path: '', component: AdminDashboardComponent } ,  // <- this handles '/admin'
      { path: 'users/:userId/payments', component: UserPaymentsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
