import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from 'src/app/core/pipes/safe.pipe';


@NgModule({
  declarations: [SafePipe],
  exports: [SafePipe], // Export the pipe so it can be used in other modules
  imports: [CommonModule]
})
export class SharedModule { }
