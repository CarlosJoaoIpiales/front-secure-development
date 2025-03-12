import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    providers: [MessageService]
})
export class RegisterComponent implements OnInit {
    registerForm!: FormGroup;
    passwordStrengthMessage = '';
    passwordConfirmationMessage = '';
    password = '';
    securityQuestions = [
        { name: '¿Cuál es el nombre de tu primera mascota?', value: '' },
        { name: '¿Cuál es el nombre de tu escuela primaria?', value: '' },
        { name: '¿Cuál es tu comida favorita?', value: '' },
    ];
    employment= [
        { name: 'Empleado', value: 'empleado' },
        { name: 'Desempleado', value: 'desempleado' },
        { name: 'Autónomo', value: 'autonomo' },
        { name: 'Empresario', value: 'empresario' },
        { name: 'Jubilado', value: 'jubilado' }
    ];
    employmentStatus = '';
    selectedSecurityQuestion = '';
    answer = '';

    constructor(private readonly fb: FormBuilder, private readonly authService: AuthService, private readonly messageService: MessageService, private readonly router: Router) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
            lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
            email: ['', [Validators.required, Validators.email]],
            id: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            address: [''],
            income: [''],
            creditScore: [''],
            employmentStatus: ['', Validators.required],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')
            ]],
            answer: ['', Validators.required],
        });
    }

    checkPasswordStrength(password: string) {
        if (password.length < 8) {
            this.passwordStrengthMessage = 'La contraseña es demasiado corta';
        } else if (!/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
            this.passwordStrengthMessage = 'Incluye al menos una letra mayúscula, un número y un carácter especial';
        } else {
            this.passwordStrengthMessage = 'Contraseña segura';
        }
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            const registerRequest = {
                email: this.registerForm.get('email')?.value,
                password: this.registerForm.get('password')?.value,
                firstName: this.registerForm.get('name')?.value,
                lastName: this.registerForm.get('lastname')?.value,
                idNumber: this.registerForm.get('id')?.value,
                phoneNumber: this.registerForm.get('phone')?.value,
                answerQuestion: this.registerForm.get('answer')?.value,
                address: this.registerForm.get('address')?.value,
                income: this.registerForm.get('income')?.value,
                creditScore: this.registerForm.get('creditScore')?.value,
                employmentStatus: this.registerForm.get('employmentStatus')?.value.value,
                role: 'USER'
            };
            console.log('Register request', registerRequest);

            this.authService.register(registerRequest).subscribe({
                next: response => {
                    console.log('User registered', response);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Usuario registrado exitosamente', life: 3000 });
                    this.router.navigate(['/auth/login']);
                },
                error: error => {
                    console.log('Registration failed', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar el usuario', life: 3000 });
                }
            });
        } else {
            console.log('Form is invalid');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Formulario inválido', life: 3000 });
            this.getFormValidationErrors();
        }
    }

    getFormValidationErrors() {
        Object.keys(this.registerForm.controls).forEach(key => {
            const controlErrors = this.registerForm.get(key)?.errors;
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach(keyError => {
                    console.log(`Key control: ${key}, keyError: ${keyError}, error value: ${controlErrors[keyError]}`);
                });
            }
        });
    }
}