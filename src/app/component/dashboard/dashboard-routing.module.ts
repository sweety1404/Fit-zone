import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';


@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: DashboardComponent }
	])] ,
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
