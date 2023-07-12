import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TcComponent } from './tc.component';


@NgModule({
  imports: [RouterModule.forChild([
      { path: '', component: TcComponent }
  ])],
  exports: [RouterModule]
})
export class TcRoutingModule { }


