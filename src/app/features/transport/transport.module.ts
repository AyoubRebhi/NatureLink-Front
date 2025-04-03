import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportRoutingModule } from './transport-routing.module';
import { ListTransportComponent } from './components/list-transport/list-transport.component';
import { AddTransportComponent } from './components/add-transport/add-transport.component';
import { EditTransportComponent } from './components/edit-transport/edit-transport.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsTransportComponent } from './components/details-transport/details-transport.component';

@NgModule({
  declarations: [
    ListTransportComponent,
    AddTransportComponent,
    EditTransportComponent,
    DetailsTransportComponent,
  ],
  imports: [
    CommonModule,
    TransportRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class TransportModule { }
