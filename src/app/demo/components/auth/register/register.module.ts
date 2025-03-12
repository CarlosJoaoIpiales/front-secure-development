import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RecaptchaModule } from 'ng-recaptcha';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from "primeng/dropdown";
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from "primeng/inputtextarea";

@NgModule({
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordModule,
        ToastModule,
        RecaptchaModule,
        InputNumberModule,
        CalendarModule,
        DropdownModule,
        RadioButtonModule,
        InputTextareaModule,
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule { }