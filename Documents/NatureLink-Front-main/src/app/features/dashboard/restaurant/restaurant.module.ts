import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';  // Assure-toi que ReactiveFormsModule est bien importé
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';
import { RestaurantUpdateComponent } from './components/restaurant-update/restaurant-update.component';


@NgModule({
  declarations: [
    RestaurantListComponent,
    RestaurantFormComponent ,
    RestaurantUpdateComponent

  ],
  imports: [
    CommonModule,
    RestaurantRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class RestaurantModule { }
