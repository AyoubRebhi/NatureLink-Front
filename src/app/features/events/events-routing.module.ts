import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDComponent } from './events/components/event-d/event-d.component';
import { EventMComponent } from './events/components/event-m/event-m.component';
import { EventAddComponent } from './events/components/event-add/event-add.component';
import { EventUserlistComponent } from './events/components/event-userlist/event-userlist.component';
import { EventUpdateComponent } from './events/components/event-update/event-update.component';
const routes: Routes = [
  {path:'detail',component:EventDComponent},
  {path:'management',component:EventMComponent},
  {path:'Add',component:EventAddComponent},
  {path:'userjoin',component:EventUserlistComponent},
  {path:'update/:id',component:EventUpdateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
