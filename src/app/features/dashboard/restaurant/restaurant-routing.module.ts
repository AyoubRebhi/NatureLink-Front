import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';
import { RestaurantUpdateComponent } from './components/restaurant-update/restaurant-update.component';

const routes: Routes = [
  { path: '', component: RestaurantListComponent },
  { path: 'add', component: RestaurantFormComponent },
  { path: 'edit/:id', component: RestaurantUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
