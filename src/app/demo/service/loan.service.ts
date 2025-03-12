import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../api/loan.model';

@Injectable({
    providedIn: 'root'
})
export class LoanService {
    private readonly apiUrl = 'http://localhost:8080/api/loans';

    constructor(private readonly http: HttpClient) { }

    getLoanCount(userId: string): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/count/${userId}`);
    }

    getNextPaymentDate(userId: string): Observable<string> {
        return this.http.get<string>(`${this.apiUrl}/next-payment-date/${userId}`);
    }

    getUserLoans(userId: string): Observable<Loan[]> {
        return this.http.get<Loan[]>(`${this.apiUrl}/user/${userId}`);
    }

    createLoan(loan: Loan): Observable<Loan> {
        return this.http.post<Loan>(`${this.apiUrl}`, loan);
    }

    payLoan(loanId: string, amount: number): Observable<any> {
        const payload = { amount };
        console.log('Payload for payLoan:', JSON.stringify(payload, null, 2));
        return this.http.post<any>(`${this.apiUrl}/${loanId}/pay`, payload);
    }
}