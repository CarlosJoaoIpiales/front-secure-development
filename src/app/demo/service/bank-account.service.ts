import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount } from '../api/bank-account.model';
import { BankAccountDetails } from '../api/bank-account-details.model';

@Injectable({
    providedIn: 'root'
})
export class BankAccountService {
    private readonly apiUrl = 'http://localhost:8080/api/bankaccounts';

    constructor(private readonly http: HttpClient) { }

    getUserBankAccounts(userId: string): Observable<BankAccount[]> {
        return this.http.get<BankAccount[]>(`${this.apiUrl}/user/${userId}`);
    }

    getUserBankAccountDetails(userId: string): Observable<BankAccountDetails> {
        return this.http.get<BankAccountDetails>(`${this.apiUrl}/details/${userId}`);
    }
}