import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { EventsRoutingModule } from './events-routing.module';
import { EventDComponent } from './events/components/event-d/event-d.component';
import { EventMComponent } from './events/components/event-m/event-m.component';
import { EventAddComponent } from './events/components/event-add/event-add.component';
import { EevntformComponent } from './events/components/eevntform/eevntform.component';
import { EventUserlistComponent } from './events/components/event-userlist/event-userlist.component';
import { EventUpdateComponent } from './events/components/event-update/event-update.component';
import { FilterByTitlePipe } from 'src/app/shared/pipes/filter-by-title.pipe';
import { FilterByDatePipe } from 'src/app/shared/pipes/filter-by-date.pipe';

@NgModule({
  declarations: [
    EventDComponent,
    EventMComponent,
    EventAddComponent,
    EevntformComponent,
    EventUserlistComponent,
    EventUpdateComponent,
    FilterByTitlePipe,
    FilterByDatePipe
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EventsRoutingModule
  ]
})
export class EventsModule { }
