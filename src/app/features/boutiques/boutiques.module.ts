import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BoutiquesRoutingModule } from './boutiques-routing.module';
import { BoutiqueInfoComponent } from './components/boutique-info/boutique-info.component';
import { ListBoutiquesComponent } from './components/list-boutiques/list-boutiques.component';
import { BoutiqueAddComponent } from './components/boutique-add/boutique-add.component';
import { BoutiqueProductAddComponent } from './components/boutique-product-add/boutique-product-add.component';
import { BoutiqueUpdateComponent } from './components/boutique-update/boutique-update.component';
import { BoutiqueDeleteComponent } from './components/boutique-delete/boutique-delete.component';
import { FilterbPipe } from 'src/app/shared/filterb.pipe';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    BoutiqueInfoComponent,
    ListBoutiquesComponent,
    BoutiqueAddComponent,
    BoutiqueProductAddComponent,
    BoutiqueUpdateComponent,
    FilterbPipe,
    BoutiqueDeleteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BoutiquesRoutingModule
  ]
})
export class BoutiquesModule { }
