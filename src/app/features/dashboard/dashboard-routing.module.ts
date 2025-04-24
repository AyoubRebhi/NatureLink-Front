
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from 'src/app/layouts/dashboard/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'restaurants',
        pathMatch: 'full'
      },
      {
        path: 'restaurants',
        loadChildren: () => import('./restaurant/restaurant.module').then(m => m.RestaurantModule)
      },
      {
        path: 'restaurants/details/:restaurantId/menus',
        loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule)
      },
      {
        path: 'monument',
        loadChildren: () => import('./monument/monument.module').then(m => m.MonumentModule)
      },
      {
        path: 'monument/details/:monumentId',
        children: [
          {
            path: 'edit',
            loadChildren: () => import('./monument/monument.module').then(m => m.MonumentModule)
          },
          {
            path: 'add',
            loadChildren: () => import('./monument/monument.module').then(m => m.MonumentModule)
          }
        ]
      },
      {
        path: 'guides',
        loadChildren: () => import('./guide/guide.module').then(m => m.GuideModule)
      },
      {
        path: 'guides/details/:guideId',
        children: [
          {
            path: 'edit',
            loadChildren: () => import('./guide/guide.module').then(m => m.GuideModule)
          },
          {
            path: 'add',
            loadChildren: () => import('./guide/guide.module').then(m => m.GuideModule)
          }
        ]
      },
      {
        path: 'visit',
        loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule)
      },
      {
        path: 'visit/details/:visitId',
        children: [
          {
            path: 'edit',
            loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule)
          },
          {
            path: 'add',
            loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule)
          }
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

