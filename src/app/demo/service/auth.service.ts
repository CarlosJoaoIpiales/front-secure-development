import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse } from '../api/auth-response.model';
import { RegisterRequest } from '../api/register-request.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly loginApiUrl = 'http://localhost:8080/api/auth/login';
    private readonly registerApiUrl = 'http://localhost:8080/api/auth/register';
    private readonly maxLoginAttempts = 3;
    private loginAttempts = 0;

    constructor(private readonly http: HttpClient, private readonly router: Router) { }

    login(email: string, password: string): Observable<AuthResponse> {
        if (this.loginAttempts >= this.maxLoginAttempts) {
            return throwError(() => new Error('Máximo número de intentos alcanzado. Inténtelo más tarde.'));
        }

        return this.http.post<AuthResponse>(this.loginApiUrl, { email, password }).pipe(
            tap(response => {
                this.loginAttempts = 0;
                const expirationDate = new Date();
                expirationDate.setMinutes(expirationDate.getMinutes() + 30); 
                localStorage.setItem('token', response.token);
                localStorage.setItem('tokenExpiration', expirationDate.toISOString());
                localStorage.setItem('role', response.role.toLowerCase());
            }),
            catchError(error => {
                this.loginAttempts++;
                return throwError(() => error);
            })
        );
    }

    register(registerRequest: RegisterRequest): Observable<any> {
        return this.http.post<any>(this.registerApiUrl, registerRequest);
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        if (token && tokenExpiration) {
            const expirationDate = new Date(tokenExpiration);
            if (new Date() < expirationDate) {
                return true;
            } else {
                this.logout();
                return false;
            }
        }
        return false;
    }

    getUserRole(): string {
        const role = localStorage.getItem('role');
        return role;
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('role');
        this.router.navigate(['/auth/login']);
    }
}