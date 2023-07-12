import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { StudentsComponent } from './students.component';
import { StudentssRoutingModule } from './students-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        SliderModule,
        StudentssRoutingModule
    ],
    declarations: [StudentsComponent]
})
export class StudentsModule { }
