import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';  // Assure-toi que ReactiveFormsModule est bien importé
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';
import { RestaurantUpdateComponent } from './components/restaurant-update/restaurant-update.component';
import { RouterModule } from '@angular/router';
import { RestaurantFrontListComponent } from 'src/app/pages/Restaurant/restaurant-front-list/restaurant-front-list.component';
import { RestaurantDetailComponent } from 'src/app/pages/Restaurant/restaurant-detail/restaurant-detail.component';


@NgModule({
  declarations: [
    RestaurantListComponent,
    RestaurantFormComponent ,
    RestaurantUpdateComponent,
    RestaurantFrontListComponent,
    RestaurantDetailComponent

  ],
  imports: [
    CommonModule,
    RestaurantRoutingModule,
    ReactiveFormsModule,
    FormsModule, CommonModule,
    RouterModule
  ]
})
export class RestaurantModule { }
