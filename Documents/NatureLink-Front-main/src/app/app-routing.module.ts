import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { MonumentDetailComponent } from './pages/home/monument-detail/monument-detail.component';
import { MonumentFrontComponent } from './pages/home/monument-front/monument-front.component';
import { RestaurantDetailComponent } from './pages/home/restaurant-detail/restaurant-detail.component';
import { RestoFrontComponent } from './pages/home/resto-front/resto-front.component';
import { VisitDetailComponent } from './pages/home/visit-detail/visit-detail.component';
import { VisitFrontComponent } from './pages/home/visit-front/visit-front.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'restaurants', component: RestoFrontComponent },
      { path: 'restaurant/:id', component: RestaurantDetailComponent },
      { path: 'monuments', component: MonumentFrontComponent },
      { path: 'monument/:id', component: MonumentDetailComponent },
      { path: 'visits', component: VisitFrontComponent },
      { path: 'visit/:id', component: VisitDetailComponent },
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: '**', component: NotFoundComponent } // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
