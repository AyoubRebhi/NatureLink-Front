import { Clothing } from './../../model/Clothing.model';
import { ClothingListComponent } from '../Clothing/clothing-list/clothing-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { AddClothingComponent } from '../Clothing/add-clothing/add-clothing.component';
import { AddFoodComponent } from '../Food/add-food/add-food.component';
import { ListFoodComponent } from '../Food/list-food/list-food.component';
import { UpdateFoodComponent } from '../Food/update-food/update-food.component';
import { UpdateClothingComponent } from '../Clothing/update-clothing/update-clothing.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'addclothing', component: AddClothingComponent },
      { path: 'ClothingList', component: ClothingListComponent },
      { path: 'FoodAdd', component: AddFoodComponent },
      { path: 'FoodList', component: ListFoodComponent },
      {path: 'FoodUpdate/:id', component: UpdateFoodComponent},
      {path: 'ClothingUpdate/:id', component: UpdateClothingComponent},
      



    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
