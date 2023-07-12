import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TrainersComponent } from './trainers.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TrainersComponent }
	])],
	exports: [RouterModule]
})
export class TrainersRoutingModule { }
