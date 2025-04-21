import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PackAddComponent } from './components/pack-add/pack-add.component';
import { PackUpdateComponent } from './components/pack-update/pack-update.component';
import { PackListAComponent } from './components/pack-list-a/pack-list-a.component';
import { FrontListComponent } from './components/pack-list-f/pack-list-f.component';
import { PackRoutingModule } from './pack-routing.module';

import { HeaderDashComponent } from 'src/app/layouts/dashboard/dashboard-layout/header-dash/header-dash.component';
import { SidebarDashComponent } from 'src/app/layouts/dashboard/dashboard-layout/sidebar-dash/sidebar-dash.component';

@NgModule({
  declarations: [
    PackAddComponent,
    PackUpdateComponent,
    PackListAComponent,
    FrontListComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PackRoutingModule,
  ],
  exports: [
    PackAddComponent,
    PackUpdateComponent,
    PackListAComponent,
    FrontListComponent
  ]
})
export class PackModule {}
