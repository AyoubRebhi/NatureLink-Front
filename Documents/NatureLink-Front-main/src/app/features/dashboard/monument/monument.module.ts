import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonumentRoutingModule } from './monument-routing.module';
import { MonumentListComponent } from './components/monument-list/monument-list.component';
import { MonumentFormComponent } from './components/monument-form/monument-form.component';
import { MonumentUpdateComponent } from './components/monument-update/monument-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MonumentListComponent,
    MonumentFormComponent,
    MonumentUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
     ReactiveFormsModule,
    MonumentRoutingModule
  ]
})
export class MonumentModule { }
