export interface BankAccount {
    id: string;
    accountNumber: string;
    balance: number;
    user: {
        id: string;
    };
}