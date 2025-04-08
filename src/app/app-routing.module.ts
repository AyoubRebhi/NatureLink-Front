import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { HomeComponent } from './pages/home/home.component';
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
      // MainLayoutComponent will be used for the general content
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServicesComponent },
      // You can load events module here if necessary
      {
        path: 'events', 
        data: { adminView: false} ,
        loadChildren: () =>
          import('./features/events/events.module').then(m => m.EventsModule),
      },
      {
        path: 'boutiques', 
        loadChildren: () =>
          import('./features/boutiques/boutiques.module').then(m => m.BoutiquesModule),
      },
      
      
    ],
  },

  // Dashboard Layout for admin-related pages like Dashboard, Admin Settings
  {
    path: 'admin',
    component: DashboardLayoutComponent,  // MainLayoutComponent will be used for the general content
    // DashboardLayoutComponent will be used for admin pages
    children: [
      {
        path: '',  // Default route for the admin dashboard
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'events', 
        data: { adminView: true },
        loadChildren: () =>
          import('./features/events/events.module').then(m => m.EventsModule),
      },
      
     
    ],
  },

  // Wildcard route to catch all undefined routes (404 page)
  { path: '**', component: NotFoundComponent },
];
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
