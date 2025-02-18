import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { LoanComponent } from './loan.component';
import { LoanRoutingModule } from './loan-routing.module';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';

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
        LoanRoutingModule,
        DialogModule,
        FileUploadModule
    ],
    declarations: [LoanComponent],
    exports: [LoanComponent],
})
export class LoanModule { }

