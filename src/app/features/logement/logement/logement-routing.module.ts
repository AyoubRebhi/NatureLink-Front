import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogementListComponent } from '../components/logement-list/logement-list.component';
import { LogementCreateComponent } from '../components/logement-create/logement-create.component';
import { LogementEditComponent } from '../components/logement-edit/logement-edit.component';

const routes: Routes = [
  { path: '', component: LogementListComponent },  // Default to the list
  { path: 'create', component: LogementCreateComponent },  // Create page
  { path: 'edit/:id', component: LogementEditComponent },  // Edit page
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogementRoutingModule {}
