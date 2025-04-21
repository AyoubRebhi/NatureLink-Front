import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationCreateComponent } from './components/reservation-create/reservation-create.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ReservationUpdateComponent } from './components/reservation-update/reservation-update.component';
import { ReservationAllComponent } from './components/reservation-all/reservation-all.component';

const routes: Routes = [
    { path: 'reservation-list', component: ReservationListComponent },
    { path: 'create', component: ReservationCreateComponent },
  { path: 'update/:id', component: ReservationUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule {}
