import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDComponent } from './events/components/event-d/event-d.component';
import { EventMComponent } from './events/components/event-m/event-m.component';
const routes: Routes = [
  {path:'detail',component:EventDComponent},
  {path:'management',component:EventMComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
