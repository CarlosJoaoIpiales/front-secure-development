import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
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
    selectedSecurityQuestion = '';
    answer = '';

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
            lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
            email: ['', [Validators.required, Validators.email]],
            id: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')
            ]],
            /*recaptcha: ['', Validators.required]*/
        });
    }

    checkPasswordStrength(password: string) {
        if (password.length < 8) {
            this.passwordStrengthMessage = 'La contraseña es demasiado corta';
        } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            this.passwordStrengthMessage = 'Incluye al menos una letra mayúscula, un número y un carácter especial';
        } else {
            this.passwordStrengthMessage = 'Contraseña segura';
        }
    }
    checkPasswordConfirmation(confirmPassword: string) {
        if (this.password !== confirmPassword) {
            this.passwordConfirmationMessage = 'Las contraseñas no coinciden';
        } else {
            this.passwordConfirmationMessage = '';
        }
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            console.log('Form Values:', this.registerForm.value);
        } else {
            console.log('Form is invalid');
        }
        /*if (this.registerForm.valid) {
          this.recaptchaService.validate(this.registerForm.get('recaptcha')?.value).subscribe(valid => {
            if (valid) {
              this.authService.register(this.registerForm.value).subscribe(response => {
                console.log('User registered', response);
              });
            } else {
              console.log('Recaptcha validation failed');
            }
          });
        }*/
    }
}