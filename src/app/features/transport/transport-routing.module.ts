import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTransportComponent } from './components/list-transport/list-transport.component';
import { AddTransportComponent } from './components/add-transport/add-transport.component';
import { EditTransportComponent } from './components/edit-transport/edit-transport.component';
import { DetailsTransportComponent } from './components/details-transport/details-transport.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/core/models/user.model';

const routes: Routes = [
  { 
    path: '', 
    component: ListTransportComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.AGENCE, Role.ADMIN] } // Allow both AGENCE and ADMIN
  },
  { 
    path: 'add', 
    component: AddTransportComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.AGENCE] } // Only AGENCE
  },
  { 
    path: 'edit/:id', 
    component: EditTransportComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.AGENCE] } // Only AGENCE
  },
  { 
    path: 'details/:id', 
    component: DetailsTransportComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.AGENCE, Role.ADMIN] } // Allow both
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportRoutingModule { }