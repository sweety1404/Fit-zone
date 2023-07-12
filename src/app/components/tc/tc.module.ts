import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TcRoutingModule } from './tc-routing.module';
import { TcComponent } from './tc.component';


@NgModule({
  declarations: [
    TcComponent
  ],
  imports: [
    CommonModule,
    TcRoutingModule
  ]
})
export class TcModule { }
