import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuideRoutingModule } from './guide-routing.module';
import { GuideListComponent } from './components/guide-list/guide-list.component';

import { GuideUpdateComponent } from './components/guide-update/guide-update.component';
import { GuideFormComponent } from './components/guide-form/guide-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GuideListComponent,
    GuideFormComponent,
    GuideUpdateComponent
  ],
  imports: [
    CommonModule,
    GuideRoutingModule,
     ReactiveFormsModule,
     FormsModule
  ]
})
export class GuideModule { }
