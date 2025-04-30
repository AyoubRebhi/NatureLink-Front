import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoutiqueInfoComponent } from './components/boutique-info/boutique-info.component';
import { ListBoutiquesComponent } from './components/list-boutiques/list-boutiques.component';
import { BoutiqueAddComponent } from './components/boutique-add/boutique-add.component';
import { BoutiqueProductAddComponent } from './components/boutique-product-add/boutique-product-add.component';
import { BoutiqueUpdateComponent } from './components/boutique-update/boutique-update.component';
const routes: Routes = [
   {path:'boutique-info/:id/products',component:BoutiqueInfoComponent},
   {path:'list-boutiques',component:ListBoutiquesComponent},
   {path:'boutique-add',component:BoutiqueAddComponent},
   {path:'product-add/:id',component:BoutiqueProductAddComponent},
   {path:'boutique-update/:id',component: BoutiqueUpdateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoutiquesRoutingModule { }
