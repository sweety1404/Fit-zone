import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubreportsComponent } from './subreports.component';


@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: SubreportsComponent }
	])],
  exports: [RouterModule]
})
export class SubreportsRoutingModule { }

