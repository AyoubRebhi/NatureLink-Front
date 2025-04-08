import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoutiqueInfoComponent } from './components/boutique-info/boutique-info.component';
import { ListBoutiquesComponent } from './components/list-boutiques/list-boutiques.component';
const routes: Routes = [
   {path:'boutique-info',component:BoutiqueInfoComponent},
   {path:'list_boutiques',component:ListBoutiquesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoutiquesRoutingModule { }
