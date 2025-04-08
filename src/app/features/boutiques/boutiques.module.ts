import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoutiquesRoutingModule } from './boutiques-routing.module';
import { BoutiqueInfoComponent } from './components/boutique-info/boutique-info.component';
import { ListBoutiquesComponent } from './components/list-boutiques/list-boutiques.component';


@NgModule({
  declarations: [
    BoutiqueInfoComponent,
    ListBoutiquesComponent
  ],
  imports: [
    CommonModule,
    BoutiquesRoutingModule
  ]
})
export class BoutiquesModule { }
