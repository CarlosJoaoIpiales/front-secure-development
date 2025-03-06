import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../service/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    email: string = '';
    password: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService,
    ) { }

    login() { 
        this.authService.login(this.email, this.password).subscribe(
            response => {
                if (response.token && response.role === 'USER') {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userId', response.userId);
                    localStorage.setItem('role', response.role);
                    console.log(`User ID stored in local storage: ${response.userId}`);
                    this.router.navigate(['/user/dashboard']);
                } else if (response.role === 'ADMIN') {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userId', response.userId);
                    localStorage.setItem('role', response.role);
                    console.log(`User ID stored in local storage: ${response.userId}`);
                    this.router.navigate(['/admin/dashboard']);

                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas', life: 3000 });
                    alert('Credenciales incorrectas');
                }
            },
            error => {
                if (error.status === 0) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo establecer conexión con el servidor', life: 3000 });
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error inesperado', life: 3000 });
                }
            }
        );
    }

    registerAccount() {
        this.router.navigate(['/auth/register']);
    }

    forgotPasswordAccount() {
        this.router.navigate(['/auth/forgot-password']);
    }
}