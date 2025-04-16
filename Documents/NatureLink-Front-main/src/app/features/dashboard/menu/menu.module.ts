import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuFormComponent } from './components/menu-form/menu-form.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuRoutingModule } from './menu-routing.module';
import { MenuUpdateComponent } from './components/menu-update/menu-update.component';

@NgModule({
  declarations: [
    MenuListComponent,
    MenuFormComponent,
    MenuUpdateComponent

  ],
  imports: [
    CommonModule,
    FormsModule,            // Nécessaire pour ngModel
    ReactiveFormsModule,    // Si tu veux utiliser les formulaires réactifs
    RouterModule,           // Nécessaire pour routerLink
    MenuRoutingModule
  ],
  exports: [
    MenuListComponent
  ]
})
export class MenuModule { }
