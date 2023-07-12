import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnisComponent } from './alumnis.component';


@NgModule({
  imports:[RouterModule.forChild([
		{ path: '', component: AlumnisComponent }
	])] ,
  exports: [RouterModule]
})
export class AlumnisRoutingModule { }
