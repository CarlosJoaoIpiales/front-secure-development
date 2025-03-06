export interface Loan {
    id?: string;
    amount: number;
    term: number;
    amortizationMethod: string;
    interestRate: number;
    insurancePerMonth: number;
    monthlyPayment: number;
    totalInterest: number;
    totalInsurance: number;
    totalToPay: number;
    approved?: boolean;
    startDate?: Date;
    endDate?: Date;
    method?: string;
    remainingBalance?: number;
    paymentsMade?: number;
    user: {
        id: string;
    };
}
