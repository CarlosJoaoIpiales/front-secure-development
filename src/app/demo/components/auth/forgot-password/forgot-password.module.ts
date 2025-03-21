import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { StepperModule } from 'primeng/stepper';
import { ListboxModule } from 'primeng/listbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        TabViewModule,
        InputTextModule,
        PanelModule,
        TableModule,
        ProgressBarModule,
        ToastModule,
        ForgotPasswordRoutingModule,
        DialogModule,
        FileUploadModule,
        StepperModule,
        ListboxModule,
        InputNumberModule,
        CardModule,
        ReactiveFormsModule
    ],
    declarations: [ForgotPasswordComponent],
    exports: [ForgotPasswordComponent],
})
export class ForgotPasswordModule { }

