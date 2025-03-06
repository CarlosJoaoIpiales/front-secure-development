import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BankAccountService } from '../../../service/bank-account.service';
import { TransactionService } from '../../../service/transaction.service';
import { BankAccountDetails } from '../../../api/bank-account-details.model';
import { Transaction } from '../../../api/transaction.model';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
    providers: [MessageService],
})
export class AccountComponent implements OnInit, OnDestroy {
    accountNumber: string = '';
    balance: number = 0;
    transactions: Transaction[] = [];
    subscription!: Subscription;

    constructor(
        private layoutService: LayoutService,
        private router: Router,
        private messageService: MessageService,
        private bankAccountService: BankAccountService,
        private transactionService: TransactionService
    ) { }

    ngOnInit() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.subscription = this.bankAccountService.getUserBankAccountDetails(userId).subscribe(
                (details: BankAccountDetails) => {
                    this.accountNumber = details.accountNumber;
                    this.balance = details.balance;
                    console.log('Bank account details:', details);
                    this.loadTransactions(details.id);
                },
                error => {
                    console.error('Error fetching bank account details', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los detalles de la cuenta bancaria', life: 3000 });
                }
            );
        }
    }

    loadTransactions(accountNumber: string) {
        this.subscription = this.transactionService.getTransactionsByBankAccountId(accountNumber).subscribe(
            (transactions: Transaction[]) => {
                this.transactions = transactions;
                console.log('Transactions:', this.transactions);
            },
            error => {
                console.error('Error fetching transactions', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las transacciones', life: 3000 });
            }
        );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    reloadPage() {
        window.location.reload();
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
    }
}