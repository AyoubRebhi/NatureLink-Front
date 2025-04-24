import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitFormComponent } from './components/visit-form/visit-form.component';
import { VisitListComponent } from './components/visit-list/visit-list.component';
import { VisitUpdateComponent } from './components/visit-update/visit-update.component';
import { VisitFrontComponent } from 'src/app/pages/Visit/visit-front/visit-front.component';


const routes: Routes = [
  { path: '', component: VisitListComponent },         // Liste des visites
  { path: 'add', component: VisitFormComponent },      // Ajout d'une visite
  { path: 'edit/:id', component: VisitUpdateComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitRoutingModule { }
