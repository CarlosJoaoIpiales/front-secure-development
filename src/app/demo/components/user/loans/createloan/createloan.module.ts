import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextModule } from "primeng/inputtext";
import {CreateLoanComponent} from './createloan.component';
import {CreateLoanRoutingModule} from './createloan-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { GoogleMapsModule } from "@angular/google-maps";
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        MultiSelectModule,
        InputTextModule,
        CheckboxModule,
        GoogleMapsModule,
        RadioButtonModule,
        ToolbarModule,
        ButtonModule,
        ToastModule,
        DialogModule,
        DividerModule,
        InputNumberModule,
        SelectButtonModule,
        CardModule,
        TableModule,
        CreateLoanRoutingModule,
    ],
    declarations: [CreateLoanComponent]
})
export class CreateLoanModule { }
