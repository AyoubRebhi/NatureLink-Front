import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivityRoutingModule } from './activity-routing.module';
import { AddActivityComponent } from './components/add-activity/add-activity.component';
import { EditActivityComponent } from './components/edit-activity/edit-activity.component';
import { DetailsActivityComponent } from './components/details-activity/details-activity.component';
import { ListActivityComponent } from './components/list-activity/list-activity.component';


@NgModule({
  declarations: [
    AddActivityComponent,
    EditActivityComponent,
    DetailsActivityComponent,
    ListActivityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ActivityRoutingModule
  ]
})
export class ActivityModule { }
