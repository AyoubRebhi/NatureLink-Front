import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddActivityComponent } from './components/add-activity/add-activity.component';
import { EditActivityComponent } from './components/edit-activity/edit-activity.component';
import { DetailsActivityComponent } from './components/details-activity/details-activity.component';
import { ListActivityComponent } from './components/list-activity/list-activity.component';


const routes: Routes = [
  { path: '', component: ListActivityComponent },
  { path: 'add', component: AddActivityComponent },
  { path: 'edit/:id', component: EditActivityComponent },
  { path: 'details/:id', component: DetailsActivityComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
