import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticesComponent } from './notices.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: NoticesComponent }
	])],
  exports: [RouterModule]
})
export class NoticesRoutingModule { }
