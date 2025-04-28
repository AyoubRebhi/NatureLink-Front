import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonumentListComponent } from './components/monument-list/monument-list.component';
import { MonumentFormComponent } from './components/monument-form/monument-form.component';
import { MonumentUpdateComponent } from './components/monument-update/monument-update.component';
import { MonumentEnrichComponent } from './components/monument-enrich/monument-enrich.component';

import { MonumentFrontComponent } from 'src/app/pages/Monument/monument-front/monument-front.component';

const routes: Routes = [
  { path: '', component: MonumentListComponent },
  { path: 'add', component: MonumentFormComponent },
  { path: 'details/:id/edit', component: MonumentUpdateComponent },
  { path: 'enrich', component: MonumentEnrichComponent },

  { path: 'front', component: MonumentFrontComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonumentRoutingModule { }
