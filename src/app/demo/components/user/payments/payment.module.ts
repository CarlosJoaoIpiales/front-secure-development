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
import { PaymentComponent } from './payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
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
        PaymentRoutingModule,
        DialogModule,
        FileUploadModule,
        StepperModule,
        ListboxModule,
        InputNumberModule,
        CardModule
    ],
    declarations: [PaymentComponent],
    exports: [PaymentComponent],
})
export class PaymentModule { }

