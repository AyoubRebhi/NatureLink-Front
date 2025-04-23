import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserPaymentsComponent } from './pages/user-payments/user-payments.component';
import { ReservationAllComponent } from '../reservation/components/reservation-all/reservation-all.component';
import { PackAddComponent } from '../pack/components/pack-add/pack-add.component';
import { PackListAComponent } from '../pack/components/pack-list-a/pack-list-a.component';
import { PackUpdateComponent } from '../pack/components/pack-update/pack-update.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Role } from '../../core/models/user.model';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'transport', 
        loadChildren: () => import('../transport/transport.module').then(m => m.TransportModule) 
      },
      { 
        path: 'activity', 
        loadChildren: () => import('../activity/activity.module').then(m => m.ActivityModule) 
      },
      { path: 'reservations-all', component: ReservationAllComponent },
      { path: 'addpack', component: PackAddComponent },
      { path: 'list-admin', component: PackListAComponent },
      { path: 'update/:id', component: PackUpdateComponent },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: { roles: [Role.ADMIN] },
        children: [
          { path: '', component: AdminDashboardComponent },
          { path: 'users/:userId/payments', component: UserPaymentsComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}