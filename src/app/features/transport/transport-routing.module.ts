import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTransportComponent } from './components/list-transport/list-transport.component';
import { AddTransportComponent } from './components/add-transport/add-transport.component';
import { EditTransportComponent } from './components/edit-transport/edit-transport.component';
import { DetailsTransportComponent } from './components/details-transport/details-transport.component';

const routes: Routes = [
  { path: '', component: ListTransportComponent },
  { path: 'add', component: AddTransportComponent },
  { path: 'edit/:id', component: EditTransportComponent },
  { path: 'details/:id', component: DetailsTransportComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportRoutingModule { }
