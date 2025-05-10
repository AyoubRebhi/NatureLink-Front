import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddActivityComponent } from './components/add-activity/add-activity.component';
import { EditActivityComponent } from './components/edit-activity/edit-activity.component';
import { DetailsActivityComponent } from './components/details-activity/details-activity.component';
import { ListActivityComponent } from './components/list-activity/list-activity.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/core/models/user.model';


const routes: Routes = [
  {
    path: '', component: ListActivityComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.PROVIDER, Role.ADMIN]

    }
  }, // Allow both AGENCE and ADMIN   },
  {
    path: 'add', component: AddActivityComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.PROVIDER] }
  },
  {
    path: 'edit/:id', component: EditActivityComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.PROVIDER, Role.ADMIN] }
  },
  {
    path: 'details/:id', component: DetailsActivityComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.PROVIDER, Role.ADMIN] }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
