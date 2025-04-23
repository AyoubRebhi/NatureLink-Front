import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { Role } from './core/models/user.model';
import { PaymentsComponent } from './pages/payments/payments/payments.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { ActivityDetailsComponent } from './pages/activity-details/activity-details.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'activities', component: ActivityComponent },
      { path: 'details/:id', component: ActivityDetailsComponent },
      { 
        path: 'profile', 
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'reservation',
        loadChildren: () =>
          import('./features/reservation/reservation.module').then(m => m.ReservationModule)
      },
      {
        path: 'packs',
        loadChildren: () => import('./features/pack/pack.module').then(m => m.PackModule)
      }
    ]
  },
  { 
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) 
  },
  {
    path: 'admin',
    loadChildren: () => 
      import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN] // Specify required role
    }
  },
  { 
    path: 'payments', 
    component: PaymentsComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'activity',
    loadChildren: () => import('./features/activity/activity.module').then(m => m.ActivityModule)
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}