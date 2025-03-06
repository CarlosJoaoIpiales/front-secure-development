export interface Transaction {
    id: string;
    amount: number;
    transactionDate: Date;
    description: string;
    bankAccount: {
        id: string;
    };
}