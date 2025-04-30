import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackAddComponent } from './components/pack-add/pack-add.component';
import { PackUpdateComponent } from './components/pack-update/pack-update.component';
import { PackListAComponent } from './components/pack-list-a/pack-list-a.component';
import { FrontListComponent } from './components/pack-list-f/pack-list-f.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-admin', pathMatch: 'full' },
  { path: 'add', component: PackAddComponent },
  { path: 'update/:id', component: PackUpdateComponent },
  { path: 'list-admin', component: PackListAComponent },
  { path: 'list-frontend', component: FrontListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackRoutingModule {}
