import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { ActivityDetailsComponent } from './pages/activity-details/activity-details.component';
import { PaymentsComponent } from './pages/payments/payments/payments.component';
import { LogementListFrontComponent } from './features/logement/components/logement-list-front/logement-list-front.component';
import { LogementDetailComponent } from './features/logement/components/logement-detail/logement-detail.component';
import { PostFormComponent } from './features/Post/post-form/post-form.component';
import { PostListComponent } from './features/Post/post-list/post-list.component';
import { AddClothingComponent } from './features/Clothing/add-clothing/add-clothing.component';
import { ListFoodClothingfrontComponent } from './features/Food/list-food-clothingfront/list-food-clothingfront.component';
import { CarbonCalculatorComponent } from './features/CarbonCalculator/carbon-calculator/carbon-calculator.component';
import { SpeechComponent } from './speech/speech.component';
import { TraveComponent } from './features/travel/trave/trave.component';
import { FrontListComponent } from './features/pack/components/pack-list-f/pack-list-f.component';
import { AuthGuard } from './core/guards/auth.guard';
import { Role } from './core/models/user.model';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'post', component: ServicesComponent },
      { path: 'activities', component: ActivityComponent },
      { path: 'details/:id', component: ActivityDetailsComponent },
      { path: 'logementsFront', component: LogementListFrontComponent },
      { path: 'logement/detail/:id', component: LogementDetailComponent },
      { path: 'postadd', component: PostFormComponent },
      { path: 'postlist', component: PostListComponent },
      { path: 'listD', component: ListFoodClothingfrontComponent },
      { path: 'carbonPrint', component: CarbonCalculatorComponent },
      { path: 'test', component: SpeechComponent },
      { path: 'recommandation', component: TraveComponent },
      {
        path: 'reservation',
        loadChildren: () =>
          import('./features/reservation/reservation.module').then(m => m.ReservationModule)
      },
      {
        path: 'packs',
        loadChildren: () =>
          import('./features/pack/pack.module').then(m => m.PackModule)
      }
    ]
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN]
    }
  },
  {
    path: 'logement',
    loadChildren: () =>
      import('./features/logement/logement/logement.module').then(m => m.LogementModule)
  },
  {
    path: 'admin/equipements',
    loadChildren: () =>
      import('./features/equipement/equipement/equipement.module').then(m => m.EquipementModule)
  },
  {
    path: 'dashboardUser',
    loadChildren: () =>
      import('./features/dashboard-user/dashboard-user.module').then(m => m.DashboardUserModule)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'activity',
    loadChildren: () =>
      import('./features/activity/activity.module').then(m => m.ActivityModule)
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [AuthGuard]
  },
  { path: 'addclothing', component: AddClothingComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }