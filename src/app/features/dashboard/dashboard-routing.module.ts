import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layout
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';

// Dashboard Page
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

// Logement
import { LogementListComponent } from '../../features/logement/components/logement-list/logement-list.component';
import { LogementCreateComponent } from '../../features/logement/components/logement-create/logement-create.component';
import { LogementEditComponent } from '../logement/components/logement-edit/logement-edit.component';
import { LogementDetailBackComponent } from '../logement/components/logement-detail-back/logement-detail-back.component';
import { LogementStatsComponent } from '../logement-stats/logement-stats.component';

// Equipement
import { EquipementListComponent } from '../equipement/equipement-list/equipement-list.component';
import { EquipementAddComponent } from '../equipement/equipement-add/equipement-add.component';
import { EquipementEditComponent } from '../equipement/equipement-edit/equipement-edit.component';

// Reservation
import { ReservationAllComponent } from '../reservation/components/reservation-all/reservation-all.component';

// Pack
import { PackAddComponent } from '../pack/components/pack-add/pack-add.component';
import { PackListAComponent } from '../pack/components/pack-list-a/pack-list-a.component';
import { PackUpdateComponent } from '../pack/components/pack-update/pack-update.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // Logement routes
      { path: 'logement/list', component: LogementListComponent },
      { path: 'logement/add', component: LogementCreateComponent },
      { path: 'logement/edit/:id', component: LogementEditComponent },
      { path: 'logement/detail/:id', component: LogementDetailBackComponent },
      { path: 'logement/stats', component: LogementStatsComponent },

      // Equipement routes
      { path: 'equipement/list', component: EquipementListComponent },
      { path: 'equipement/add', component: EquipementAddComponent },
      { path: 'equipement/edit/:id', component: EquipementEditComponent },

      // Reservation route
      { path: 'reservations-all', component: ReservationAllComponent },

      // Pack routes
      { path: 'addpack', component: PackAddComponent },
      { path: 'list-admin', component: PackListAComponent },
      { path: 'update/:id', component: PackUpdateComponent },

      // Lazy-loaded routes
      {
        path: 'transport',
        loadChildren: () =>
          import('../transport/transport.module').then((m) => m.TransportModule),
      },
      {
        path: 'activity',
        loadChildren: () =>
          import('../activity/activity.module').then((m) => m.ActivityModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
