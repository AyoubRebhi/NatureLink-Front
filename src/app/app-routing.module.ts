import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LogementListFrontComponent } from './features/logement/components/logement-list-front/logement-list-front.component';
import { LogementDetailComponent } from './features/logement/components/logement-detail/logement-detail.component'; 
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'logementsFront', component: LogementListFrontComponent },
      { path: 'logement/detail/:id', component: LogementDetailComponent },  // Add this route for logement details

    ]
  },
  {
    path: 'admin',  // This will load admin dashboard
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      )
  },
  {
    path: 'logement',
    loadChildren: () => import('./features/logement/logement/logement.module').then(m => m.LogementModule)
  },
  {
    path: 'admin/equipements',
    loadChildren: () =>
      import('../app/features/equipement/equipement/equipement.module').then((m) => m.EquipementModule),
  },
  { path: 'dashboardUser', loadChildren: () =>
     import('./features/dashboard-user/dashboard-user.module').then(m => m.DashboardUserModule) },
  
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
