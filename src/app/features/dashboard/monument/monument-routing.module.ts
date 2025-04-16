import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonumentListComponent } from './components/monument-list/monument-list.component';
import { MonumentFormComponent } from './components/monument-form/monument-form.component';
import { MonumentUpdateComponent } from './components/monument-update/monument-update.component';


const routes: Routes = [
  { path: '', component: MonumentListComponent },
  { path: 'add', component: MonumentFormComponent},
  { path: 'edit/:id', component:MonumentUpdateComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonumentRoutingModule { }
