import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    static passwordStrength(control: AbstractControl): { [key: string]: boolean } | null {
        const value = control.value;
        if (!value) {
            return null;
        }
        const hasUpperCase = /[A-Z]+/.test(value);
        const hasLowerCase = /[a-z]+/.test(value);
        const hasNumeric = /[0-9]+/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]+/.test(value);
        const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;
        if (!valid) {
            return { passwordStrength: true };
        }
        return null;
    }

    static passwordMatch(password: string, confirmPassword: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const passwordControl = control.get(password);
            const confirmPasswordControl = control.get(confirmPassword);
            
            if (!passwordControl || !confirmPasswordControl) {
                return null;
            }
    
            if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
                return null;
            }
    
            if (passwordControl.value !== confirmPasswordControl.value) {
                confirmPasswordControl.setErrors({ passwordMismatch: true });
                return { passwordMismatch: true };
            }
    
            confirmPasswordControl.setErrors(null);
            return null;
        };
    }    
}