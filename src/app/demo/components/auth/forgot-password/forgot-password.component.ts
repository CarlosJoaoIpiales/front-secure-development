import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    providers: [MessageService]
})
export class ForgotPasswordComponent {
    email: string = '';
    code: string = '';
    passwordForm: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly userService: UserService,
        private readonly messageService: MessageService,
        private readonly router: Router
    ) {
        this.passwordForm = this.fb.group({
            password: this.fb.control('', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')
            ]),
            password2: this.fb.control('', Validators.required)
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        return form.get('password').value === form.get('password2').value ? null : { mismatch: true };
    }

    requestPasswordRecovery() {
        if (this.email) {
            this.userService.requestPasswordRecovery(this.email).subscribe({
                next: response => {
                    console.log('Password recovery email sent:', response);
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Correo de recuperación enviado', life: 3000 });
                },
                error: error => {
                    console.error('Error sending password recovery email:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar el correo de recuperación', life: 3000 });
                }
            });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, ingrese su correo', life: 3000 });
        }
    }

    verifyRecoveryCode() {
        if (this.passwordForm.valid) {
            const newPassword = this.passwordForm.get('password').value;
            this.userService.verifyRecoveryCode(this.email, this.code, newPassword).subscribe({
                next: response => {
                    console.log('Password reset successful:', response);
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña restablecida con éxito', life: 3000 });
                    this.router.navigate(['/auth/login']);
                },
                error: error => {
                    console.error('Error verifying recovery code:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al verificar el código de recuperación', life: 3000 });
                }
            });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, complete el formulario correctamente', life: 3000 });
        }
    }
}