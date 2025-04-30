import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuideListComponent } from './components/guide-list/guide-list.component';
import { GuideFormComponent } from './components/guide-form/guide-form.component';
import { GuideUpdateComponent } from './components/guide-update/guide-update.component';


const routes: Routes = [
  { path: '', component:GuideListComponent  },
  { path: 'add', component:GuideFormComponent   },
  { path: 'edit/:id', component:GuideUpdateComponent  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuideRoutingModule { }
