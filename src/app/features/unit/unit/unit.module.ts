import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitRoutingModule } from './unit-routing.module';
import { UnitListComponent } from '../components/unit-list/unit-list.component';
import { UnitCreateComponent } from '../components/unit-create/unit-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    UnitListComponent,
    UnitCreateComponent // Ensure the component is correctly declared
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UnitRoutingModule
  ]
})
export class UnitModule { }
