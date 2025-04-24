import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MonumentRoutingModule } from './monument-routing.module';
import { MonumentListComponent } from './components/monument-list/monument-list.component';
import { MonumentFormComponent } from './components/monument-form/monument-form.component';
import { MonumentUpdateComponent } from './components/monument-update/monument-update.component';
import { MonumentEnrichComponent } from './components/monument-enrich/monument-enrich.component';

import { MonumentFrontComponent } from 'src/app/pages/Monument/monument-front/monument-front.component';
import { SharedModule } from 'src/app/shared/pipes/shared.module';


@NgModule({
  declarations: [
    MonumentFormComponent,
    MonumentUpdateComponent,
    MonumentListComponent,
    MonumentEnrichComponent,
    MonumentFrontComponent   // Added
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MonumentRoutingModule,
    SharedModule
  ]
})
export class MonumentModule { }
