import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from 'src/app/layouts/dashboard/dashboard-layout/dashboard-layout.component'; // Import du layout

const routes: Routes = [
  {
    path: '', // Route principale pour /admin
    component: DashboardLayoutComponent, // Le composant de mise en page qui inclut la barre latérale
    children: [
      {
        path: '', // Si l'utilisateur accède à /admin, redirigez-le vers /admin/restaurants
        redirectTo: 'admin',
        pathMatch: 'full'
      },
      {
        path: 'restaurants', // Liste des restaurants
        loadChildren: () => import('../restaurant/restaurant.module').then(m => m.RestaurantModule)
      },
      {
        path: 'restaurants/details/:restaurantId',
        children: [
          {
            path: 'menus',
            loadChildren: () => import('../menu/menu.module').then(m => m.MenuModule),
          },
          {
            path: 'menus/new',
            loadChildren: () => import('../menu/menu.module').then(m => m.MenuModule)
          },
          {
            path: 'menus/:menuId/edit',
            loadChildren: () => import('../menu/menu.module').then(m => m.MenuModule)
          }
        ]
      },
      {
        path: 'monument', // Liste des monuments
        loadChildren: () => import('../monument/monument.module').then(m => m.MonumentModule)
      },
      {
        path: 'monument/details/:monumentId',
        children: [
          {
            path: 'edit',
            loadChildren: () => import('../monument/monument.module').then(m => m.MonumentModule)
          },
          {
            path: 'add',
            loadChildren: () => import('../monument/monument.module').then(m => m.MonumentModule)
          }
        ]
      },
      // Ajout des routes pour les guides touristiques
      {
        path: 'guides', // Liste des guides
        loadChildren: () => import('../guide/guide.module').then(m => m.GuideModule)
      },
      {
        path: 'guides/details/:guideId',
        children: [
          {
            path: 'edit',
            loadChildren: () => import('../guide/guide.module').then(m => m.GuideModule)
          },
          {
            path: 'add',
            loadChildren: () => import('../guide/guide.module').then(m => m.GuideModule)
          }
        ]
      },
      //
      {
        path: 'visit', // Liste des guides
        loadChildren: () => import('../visit/visit.module').then(m => m.VisitModule)
      },
      {
        path: 'visit/details/:visitId',
        children: [
          {
            path: 'edit',
            loadChildren: () => import('../visit/visit.module').then(m => m.VisitModule)
          },
          {
            path: 'add',
            loadChildren: () => import('../visit/visit.module').then(m => m.VisitModule)
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
export class DashboardRoutingModule { }
