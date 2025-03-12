import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../api/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly apiUrl = 'http://localhost:8080/api/users';

    constructor(private readonly http: HttpClient) { }

    getUserById(userId: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${userId}`);
    }

    getUserCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/count`);
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }
    
    requestPasswordRecovery(email: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/request-password-recovery`, { email });
    }

    verifyRecoveryCode(email: string, recoveryCode: string, newPassword: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.apiUrl}/verify-recovery-code`, { email, recoveryCode, newPassword }, { headers, responseType: 'text' });
    }
}