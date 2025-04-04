import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventDComponent } from './events/components/event-d/event-d.component';
import { EventMComponent } from './events/components/event-m/event-m.component';


@NgModule({
  declarations: [
    EventDComponent,
    EventMComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule
  ]
})
export class EventsModule { }
