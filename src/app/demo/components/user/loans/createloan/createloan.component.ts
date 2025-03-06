import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { LoanService } from '../../../../service/loan.service';
import { Loan } from '../../../../api/loan.model';

interface AmortizationRow {
    month: number;
    capital: number;
    interest: number;
    insurance: number;
    total: number;
}

@Component({
    selector: 'app-new-loan',
    templateUrl: './createloan.component.html',
    styleUrls: ['./createloan.component.css'],
    providers: [MessageService]
})
export class CreateLoanComponent {

    amount: number = 0;
    termSelect: any = null;
    createLoanDialog: boolean = false;
    amortizationMethod: string = '';
    terms = [
        { name: '3 meses', value: 3 },
        { name: '4 meses', value: 4 },
        { name: '5 meses', value: 5 },
        { name: '6 meses', value: 6 },
        { name: '7 meses', value: 7 },
        { name: '8 meses', value: 8 },
        { name: '9 meses', value: 9 },
        { name: '10 meses', value: 10 },
        { name: '11 meses', value: 11 },
        { name: '12 meses (1.0 años)', value: 12 },
        { name: '18 meses (1.5 años)', value: 18 },
        { name: '24 meses (2.0 años)', value: 24 },
        { name: '30 meses (2.5 años)', value: 30 },
        { name: '36 meses (3.0 años)', value: 36 },
        { name: '42 meses (3.5 años)', value: 42 },
        { name: '48 meses (4.0 años)', value: 48 },
        { name: '54 meses (4.5 años)', value: 54 },
        { name: '60 meses (5.0 años)', value: 60 },
        { name: '66 meses (5.5 años)', value: 66 },
        { name: '72 meses (6.0 años)', value: 72 },
        { name: '78 meses (6.5 años)', value: 78 },
        { name: '84 meses (7.0 años)', value: 84 },
    ];
    stateOptions = [
        { label: 'Método Francés: Cuotas fijas', value: 'MF' },
        { label: 'Método Alemán: Cuotas decrecientes', value: 'MA' }
    ];
    interestRate = 15.6 / 100 / 12;
    insurancePerMonth = 0.70;
    monthlyPayment: number = 0;
    totalInterest: number = 0;
    totalInsurance: number = 0;
    totalToPay: number = 0;
    amortizationTable: AmortizationRow[] = [];
    value: string = '';
    cols: any[] = [];

    constructor(
        private location: Location,
        private loanService: LoanService
    ) { }

    onGoBack(): void {
        this.location.back();
    }

    onSave(): void {
        if (!this.amount || !this.termSelect || !this.amortizationMethod) {
            console.error('Faltan campos obligatorios');
            return;
        }

        const loan: Loan = {
            amount: this.amount,
            interestRate: this.interestRate,
            term: this.termSelect.value,
            startDate: new Date(),
            endDate: new Date(),
            approved: true,
            method: this.amortizationMethod,
            monthlyPayment: this.monthlyPayment,
            remainingBalance: this.amount,
            paymentsMade: 0,
            amortizationMethod: this.amortizationMethod, 
            insurancePerMonth: this.insurancePerMonth,
            totalInterest: this.totalInterest,
            totalInsurance: this.totalInsurance,
            totalToPay: this.totalToPay,
            user: {
                id: localStorage.getItem('userId') || '0'
            }
        };        

        console.log('Loan details:', loan);

        this.loanService.createLoan(loan).subscribe(
            response => {
                console.log('Préstamo creado con éxito:', response);
                this.location.back();
            },
            error => {
                console.error('Error al crear el préstamo:', error);
            }
        );
    }

    onClear(): void {
        this.amortizationMethod = '';
        this.amount = 0;
        this.termSelect = null;
        this.createLoanDialog = false;
        this.amortizationTable = [];
        this.totalInterest = 0;
        this.totalInsurance = 0;
        this.totalToPay = 0;
        this.monthlyPayment = 0;
    }

    calculateLoan() {
        if (!this.amount || !this.termSelect || !this.amortizationMethod) return;
        let remainingCapital = this.amount;
        let interestRate = this.interestRate;
        let totalMonths = this.termSelect.value;
        this.amortizationTable = [];
        this.totalInterest = 0;
        this.totalInsurance = totalMonths * this.insurancePerMonth;
        
        if (this.amortizationMethod === 'MF') {
            let monthlyRateFactor = Math.pow(1 + interestRate, -totalMonths);
            this.monthlyPayment = (this.amount * interestRate) / (1 - monthlyRateFactor);
    
        } else {
            this.monthlyPayment = (this.amount / totalMonths) + (remainingCapital * interestRate);
        }
    
        for (let i = 1; i <= totalMonths; i++) {
            let interest = remainingCapital * interestRate;
            let capital = 0;
    
            if (this.amortizationMethod === 'MF') {
                capital = this.monthlyPayment - interest;
            } else {
                capital = this.amount / totalMonths;
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
        this.totalToPay = this.amount + this.totalInterest + this.totalInsurance;
    }    
}