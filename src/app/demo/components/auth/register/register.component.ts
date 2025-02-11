import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CustomValidators } from '../../../service/custom-validators';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    passwordConditions = {
        hasLowerCase: false,
        hasUpperCase: false,
        hasNumeric: false,
        hasMinLength: false
    };

    dropdownItems = [
        { name: '¿Cuál fue el nombre de tu primera mascota?', code: 'Option 1' },
        { name: '¿En qué ciudad nació tu madre?', code: 'Option 2' },
        { name: '¿Cuál es el título de tu libro favorito?', code: 'Option 3' }
    ];

    constructor(private fb: FormBuilder, private recaptchaV3Service: ReCaptchaV3Service,) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            idNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            birthDate: ['', [Validators.required, this.ageValidator(18)]],
            address: [''],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, CustomValidators.passwordStrength]],
            confirmPassword: ['', Validators.required],
            securityQuestion: ['', Validators.required],
            securityAnswer: ['', Validators.required],
            terms: [false, Validators.requiredTrue]
        }, {
            validator: CustomValidators.passwordMatch('password', 'confirmPassword')
        });

        this.registerForm.get('password').valueChanges.subscribe(value => {
            this.passwordConditions.hasLowerCase = /[a-z]/.test(value);
            this.passwordConditions.hasUpperCase = /[A-Z]/.test(value);
            this.passwordConditions.hasNumeric = /[0-9]/.test(value);
            this.passwordConditions.hasMinLength = value.length >= 8;
        });
    }

    ageValidator(minAge: number) {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const birthDate = new Date(control.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= minAge ? null : { 'ageInvalid': true };
        };
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            // Handle form submission
        }
    }

    resolved(captchaResponse: string): void {
        // Handle captcha response
    }

    public executeImportantAction(): void {
        this.recaptchaV3Service.execute('importantAction')
            .subscribe((token) => this.handleToken(token));
    }
    private handleToken(token: string): void {
        // Handle the token received from reCAPTCHA
        console.log('Token received:', token);
    }
}