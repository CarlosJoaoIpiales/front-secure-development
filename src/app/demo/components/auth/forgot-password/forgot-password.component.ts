import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
    providers: [MessageService]
})
export class ForgotPasswordComponent {
    step = 1;
    forgotPasswordForm: FormGroup;
    verifyCodeForm: FormGroup;
    newPasswordForm: FormGroup;
    emailSent = false;

    constructor(private fb: FormBuilder, private messageService: MessageService) {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
        this.verifyCodeForm = this.fb.group({
            code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
        });
        this.newPasswordForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    sendCode() {
        const email = this.forgotPasswordForm.value.email;
        /*this.authService.sendResetCode(email).subscribe(
            () => {
                this.emailSent = true;
                this.step = 2;
                this.messageService.add({ severity: 'success', summary: 'Código Enviado', detail: 'Revisa tu correo electrónico' });
            },
            () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar el código' });
            }
        );*/
    }

    verifyCode() {
        const code = this.verifyCodeForm.value.code;
        /*this.authService.verifyResetCode(code).subscribe(
            (valid) => {
                if (valid) {
                    this.step = 3;
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Código Incorrecto', detail: 'El código no es válido' });
                }
            }
        );*/
    }

    resetPassword() {
        const password = this.newPasswordForm.value.password;
        /*this.authService.resetPassword(password).subscribe(
            () => {
                this.messageService.add({ severity: 'success', summary: 'Contraseña Actualizada', detail: 'Ahora puedes iniciar sesión' });
                this.step = 1;
            },
            () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la contraseña' });
            }
        );*/
    }
}