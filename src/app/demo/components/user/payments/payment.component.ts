import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Loan } from '../../../api/loan.model';
import { LoanService } from '../../../service/loan.service';
import { BankAccountService } from '../../../service/bank-account.service';
import { BankAccountDetails } from '../../../api/bank-account-details.model';
import { Location } from '@angular/common';

interface AmortizationRow {
    month: number;
    capital: number;
    interest: number;
    insurance: number;
    total: number;
}

@Component({
    templateUrl: './payment.component.html',
    providers: [MessageService],
})
export class PaymentComponent implements OnInit {

    loans: Loan[] = [];
    selectedPayment: any = null;
    payments = [
        { name: 'Efectivo', value: 1 },
        { name: 'Tarjeta', value: 2 },
    ];
    items: MenuItem[] = [];
    loading: boolean = true;
    selectedLoan: Loan | null = null;
    amount: number = 0;
    amountToPay: number = 0;
    bankAccountBalance: number = 0;
    termSelect: any = null;
    createLoanDialog: boolean = false;
    amortizationMethod: string = '';
    term: number = 0;
    interestRate = 15.6 / 100 / 12;
    insurancePerMonth = 0.70;
    monthlyPayment: number = 0;
    totalInterest: number = 0;
    totalInsurance: number = 0;
    totalToPay: number = 0;
    amortizationTable: AmortizationRow[] = [];
    value: string = '';
    cols: any[] = [];
    loanPayments: any[] = [];

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly loanService: LoanService,
        private readonly bankAccountService: BankAccountService,
        private readonly location: Location,
    ) { }

    ngOnInit() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.loanService.getUserLoans(userId).subscribe({
                next: (loans: Loan[]) => {
                    this.loans = loans;
                    console.log('Loans:', this.loans);
                    if (this.loans.length > 0) {
                        this.selectedLoan = this.loans[0];
                    }
                },
                error: error => {
                    console.error('Error fetching loans', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los préstamos', life: 3000 });
                }
            });

            this.bankAccountService.getUserBankAccountDetails(userId).subscribe({
                next: (details: BankAccountDetails) => {
                    this.bankAccountBalance = details.balance;
                },
                error: error => {
                    console.error('Error fetching bank account details', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los detalles de la cuenta bancaria', life: 3000 });
                }
            });
        }
    }

    calculateLoan() {
        console.log('Calculating loan...');
        if (!this.selectedLoan) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione un préstamo primero', life: 3000 });
            return;
        }

        if (this.amount > this.selectedLoan.amount || this.amount > this.bankAccountBalance) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El monto no puede ser mayor al monto del préstamo ni mayor a la cantidad que tiene en la cuenta bancaria', life: 3000 });
            return;
        }

        if (this.amount === this.selectedLoan.totalToPay) {
            this.selectedLoan.amount = 0;
            this.selectedLoan.remainingBalance = 0;
            this.selectedLoan.monthlyPayment = 0;
            this.selectedLoan.totalInterest = 0;
            this.selectedLoan.totalInsurance = 0;
            this.selectedLoan.totalToPay = 0;
            this.amortizationTable = [];
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Préstamo saldado completamente', life: 3000 });
            return;
        }

        const newAmount = this.selectedLoan.amount - this.amount;
        this.selectedLoan.amount = newAmount;
        this.recalculateAmortization(this.selectedLoan);
    }

    recalculateAmortization(loan: Loan) {
        this.termSelect = { value: loan.term };
        this.amortizationMethod = loan.method;
        this.amountToPay = loan.amount - this.amount;

        if (!loan.amount || !this.termSelect || !this.amortizationMethod) return;

        let remainingCapital = loan.amount;
        let interestRate = loan.interestRate;
        let totalMonths = this.termSelect.value;
        this.amortizationTable = [];
        this.totalInterest = 0;
        this.totalInsurance = totalMonths * this.insurancePerMonth;

        if (this.amortizationMethod === 'MF') {
            let monthlyRateFactor = Math.pow(1 + interestRate, -totalMonths);
            this.monthlyPayment = (loan.amount * interestRate) / (1 - monthlyRateFactor);

        } else {
            this.monthlyPayment = (loan.amount / totalMonths) + (remainingCapital * interestRate);
        }

        for (let i = 1; i <= totalMonths; i++) {
            let interest = remainingCapital * interestRate;
            let capital = 0;

            if (this.amortizationMethod === 'MF') {
                capital = this.monthlyPayment - interest;
            } else {
                capital = loan.amount / totalMonths;
                this.monthlyPayment = capital + interest;
            }

            remainingCapital -= capital;
            this.totalInterest += interest;

            this.amortizationTable.push({
                month: i,
                capital: parseFloat(capital.toFixed(2)),
                interest: parseFloat(interest.toFixed(2)),
                insurance: this.insurancePerMonth,
                total: parseFloat((this.monthlyPayment + this.insurancePerMonth).toFixed(2))
            });
        }

        this.totalToPay = loan.amount + this.totalInterest + this.totalInsurance;

        loan.monthlyPayment = this.monthlyPayment;
        loan.totalInterest = this.totalInterest;
        loan.totalInsurance = this.totalInsurance;
        loan.totalToPay = this.totalToPay;
    }

    savePayment() {
        console.log('Paying loan...', this.selectedLoan, this.amount);
        if (this.selectedPayment.value === 2) {
            this.processPayment();
        } else if (this.bankAccountBalance >= this.amount) {
            this.processPayment();
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fondos insuficientes en la cuenta bancaria', life: 3000 });
        }
    }

    processPayment() {
        this.loanService.payLoan(this.selectedLoan.id, this.amount).subscribe({
            next: response => {
                console.log('Préstamo pagado con éxito:', response);
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Préstamo pagado con éxito', life: 3000 });
                this.location.back();
            },
            error: error => {
                console.error('Error al pagar el préstamo:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al pagar el préstamo', life: 3000 });
            }
        });
    }

    printPayment() {
        console.log('Printing payment...', this.selectedPayment);
    }
}