import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisponibilityListComponent } from '../disponibility-list/disponibility-list.component';
import { DisponibilityService } from 'src/app/core/services/disponibility.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DisponibilityListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  providers: [
    DisponibilityService
  ]
})
export class DisponibilityModule { }
