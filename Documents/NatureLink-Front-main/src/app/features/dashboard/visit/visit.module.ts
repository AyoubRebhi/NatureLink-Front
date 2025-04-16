import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VisitListComponent } from './components/visit-list/visit-list.component';
import { VisitFormComponent } from './components/visit-form/visit-form.component';
import { VisitUpdateComponent } from './components/visit-update/visit-update.component';
import { VisitRoutingModule } from './visit-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    VisitListComponent,
    VisitFormComponent,
    VisitUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,              // Ajouté ici pour ngModel
    ReactiveFormsModule,
    RouterModule ,
     VisitRoutingModule,            // Ajouté ici pour routerLink
  ]
})
export class VisitModule { }
