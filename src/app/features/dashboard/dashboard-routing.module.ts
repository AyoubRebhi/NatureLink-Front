import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Role } from '../../core/models/user.model';

// Clothing and Food components
import { ClothingListComponent } from '../Clothing/clothing-list/clothing-list.component';
import { AddClothingComponent } from '../Clothing/add-clothing/add-clothing.component';
import { AddFoodComponent } from '../Food/add-food/add-food.component';
import { ListFoodComponent } from '../Food/list-food/list-food.component';
import { UpdateFoodComponent } from '../Food/update-food/update-food.component';
import { UpdateClothingComponent } from '../Clothing/update-clothing/update-clothing.component';
import { CarbonCalculatorComponent } from '../CarbonCalculator/carbon-calculator/carbon-calculator.component';

// Logement components
import { LogementListComponent } from '../logement/components/logement-list/logement-list.component';
import { LogementCreateComponent } from '../logement/components/logement-create/logement-create.component';
import { LogementEditComponent } from '../logement/components/logement-edit/logement-edit.component';
import { LogementDetailBackComponent } from '../logement/components/logement-detail-back/logement-detail-back.component';
import { LogementStatsComponent } from '../logement-stats/logement-stats.component';

// Equipement components
import { EquipementListComponent } from '../equipement/equipement-list/equipement-list.component';
import { EquipementAddComponent } from '../equipement/equipement-add/equipement-add.component';
import { EquipementEditComponent } from '../equipement/equipement-edit/equipement-edit.component';

// Reservation components
import { ReservationAllComponent } from '../reservation/components/reservation-all/reservation-all.component';

// Pack components
import { PackAddComponent } from '../pack/components/pack-add/pack-add.component';
import { PackListAComponent } from '../pack/components/pack-list-a/pack-list-a.component';
import { PackUpdateComponent } from '../pack/components/pack-update/pack-update.component';
//import { UserPaymentsComponent } from './pages/user-payments/user-payments.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      // Admin routes
      { 
        path: 'dash-admin',
        canActivate: [AuthGuard],
        data: { roles: [Role.ADMIN] },
        children: [
          { path: '', component: AdminDashboardComponent },
          //{ path: 'users/:userId/payments', component: UserPaymentsComponent }
        ]
      },

      // Regular dashboard routes
      { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

      // Restaurant routes
      {
        path: 'restaurants',
        loadChildren: () => import('./restaurant/restaurant.module').then(m => m.RestaurantModule)
      },
      {
        path: 'restaurants/details/:restaurantId/menus',
        loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule)
      },

      // Monument routes
      {
        path: 'monument',
        loadChildren: () => import('./monument/monument.module').then(m => m.MonumentModule)
      },
      {
        path: 'monument/details/:monumentId',
        children: [
          { path: 'edit', loadChildren: () => import('./monument/monument.module').then(m => m.MonumentModule) },
          { path: 'add', loadChildren: () => import('./monument/monument.module').then(m => m.MonumentModule) }
        ]
      },

      // Guide routes
      {
        path: 'guides',
        loadChildren: () => import('./guide/guide.module').then(m => m.GuideModule)
      },
      {
        path: 'guides/details/:guideId',
        children: [
          { path: 'edit', loadChildren: () => import('./guide/guide.module').then(m => m.GuideModule) },
          { path: 'add', loadChildren: () => import('./guide/guide.module').then(m => m.GuideModule) }
        ]
      },

      // Visit routes
      {
        path: 'visit',
        loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule)
      },
      {
        path: 'visit/details/:visitId',
        children: [
          { path: 'edit', loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule) },
          { path: 'add', loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule) }
        ]
      },

      // Clothing and Food routes
      { path: 'addclothing', component: AddClothingComponent },
      { path: 'ClothingList', component: ClothingListComponent },
      { path: 'FoodAdd', component: AddFoodComponent },
      { path: 'FoodList', component: ListFoodComponent },
      { path: 'FoodUpdate/:id', component: UpdateFoodComponent },
      { path: 'ClothingUpdate/:id', component: UpdateClothingComponent },
      { path: 'carbonPrint', component: CarbonCalculatorComponent },

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
        canActivate: [AuthGuard],
        data: { roles: [Role.AGENCE, Role.ADMIN]},
        loadChildren: () => import('../transport/transport.module').then(m => m.TransportModule)
      },
      {
        path: 'activity',
        canActivate: [AuthGuard],
        data: { roles: [Role.PROVIDER, Role.ADMIN] },
        loadChildren: () => import('../activity/activity.module').then(m => m.ActivityModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}