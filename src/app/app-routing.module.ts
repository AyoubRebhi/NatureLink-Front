import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';


import { VisitDetailComponent } from './pages/home/visit-detail/visit-detail.component';

import { RestaurantDetailComponent } from './pages/Restaurant/restaurant-detail/restaurant-detail.component';
import { RestaurantFrontListComponent } from './pages/Restaurant/restaurant-front-list/restaurant-front-list.component';
import { MonumentFrontComponent } from './pages/Monument/monument-front/monument-front.component';
import { VisitFrontComponent } from './pages/Visit/visit-front/visit-front.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'monuments', component: MonumentFrontComponent },
      { path: 'visit', component:VisitFrontComponent  },
      { path: 'restaurants', component: RestaurantFrontListComponent },
      { path: 'restaurants/:id', component: RestaurantDetailComponent },
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

