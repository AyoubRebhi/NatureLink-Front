import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { PostFormComponent } from './features/Post/post-form/post-form.component';
import { PostListComponent } from './features/Post/post-list/post-list.component';
import { AddClothingComponent } from './features/Clothing/add-clothing/add-clothing.component';
import { ListFoodClothingfrontComponent } from './features/Food/list-food-clothingfront/list-food-clothingfront.component';
import { CarbonCalculatorComponent } from './features/CarbonCalculator/carbon-calculator/carbon-calculator.component';
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'post', component: ServicesComponent },
      { path: 'postadd', component: PostFormComponent },
      { path: 'postlist', component: PostListComponent },
      { path: 'listD', component: ListFoodClothingfrontComponent },
      {path: 'carbonPrint', component: CarbonCalculatorComponent},


    ]
  },
  {
    path: 'admin',  // This will load admin dashboard
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      )
  },
  { path: 'addclothing', component: AddClothingComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
