import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuFormComponent } from './components/menu-form/menu-form.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuUpdateComponent } from './components/menu-update/menu-update.component';

const routes: Routes = [
  { path: '', component: MenuListComponent }, // Liste des menus pour un restaurant
  { path: 'new', component: MenuFormComponent }, // Formulaire d'ajout
  { path: ':menuId/edit', component: MenuUpdateComponent } // Edition d'un menu
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
