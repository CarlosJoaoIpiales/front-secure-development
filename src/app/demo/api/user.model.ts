export interface User {
    id?: string;
    first_name: string;
    second_name: string;
    first_last_name: string;
    second_last_name: string;
    email: string;
    password: string;
    created_at?: string;
    role: string;
    phone_number: string;
    max_loan_amount: number;
}