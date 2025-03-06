import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../api/transaction.model';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private apiUrl = 'http://localhost:8080/api/transactions/bankaccount';

    constructor(private http: HttpClient) { }

    getTransactionsByBankAccountId(bankAccountId: string): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/${bankAccountId}`);
    }
}