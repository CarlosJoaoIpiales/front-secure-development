import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoanService } from '../../../service/loan.service';
import { Loan } from '../../../api/loan.model';

@Component({
    templateUrl: './loan.component.html',
    providers: [MessageService],
})
export class LoanComponent implements OnInit {

    loans: Loan[] = [];

    constructor(
        private readonly router: Router,
        private readonly loanService: LoanService,
        private readonly messageService: MessageService,
    ) { }

    ngOnInit() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.loanService.getUserLoans(userId).subscribe({
                next: (loans: Loan[]) => {
                    this.loans = loans;
                    console.log('Loans:', this.loans);
                },
                error: error => {
                    console.error('Error fetching loans', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los préstamos', life: 3000 });
                }
            });
        }
    }

    openNew() {
        this.router.navigate(['/user/loans/new-loan']);
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
