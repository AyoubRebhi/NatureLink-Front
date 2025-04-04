import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'transport',
        loadChildren: () =>
          import('../transport/transport.module').then(m => m.TransportModule)
      },
      {
        path: 'activity',
        loadChildren: () =>
          import('../activity/activity.module').then(m => m.ActivityModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
