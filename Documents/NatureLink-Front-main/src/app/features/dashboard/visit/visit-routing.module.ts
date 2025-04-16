import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitFormComponent } from './components/visit-form/visit-form.component';
import { VisitListComponent } from './components/visit-list/visit-list.component';
import { VisitUpdateComponent } from './components/visit-update/visit-update.component';


const routes: Routes = [
  { path: '', component: VisitListComponent },         // Liste des visites
  { path: 'add', component: VisitFormComponent },      // Ajout d'une visite
  { path: 'edit/:id', component: VisitUpdateComponent } // Édition d'une visite
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitRoutingModule { }
