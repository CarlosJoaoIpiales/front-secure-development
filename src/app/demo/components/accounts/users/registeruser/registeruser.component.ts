import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../../../service/user.service';
import { CompanyService } from '../../../../service/company.service';
import { UserCompanyService } from '../../../../service/user-company.service';
import { User } from '../../../../api/user.model';
import { Company } from '../../../../api/company.model';
import { UserCompany } from '../../../../api/user-company.model';
import { MessageService } from 'primeng/api';
import { EncryptionService } from '../../../../service/encryption.service';

@Component({
    selector: 'app-register-user',
    templateUrl: './registeruser.component.html',
    styleUrls: ['./registeruser.component.css'],
    providers: [MessageService]
})
export class RegisterUserComponent implements OnInit {

    createUserDialog: boolean = false;
    user: User = {
        first_name: '',
        second_name: '',
        first_last_name: '',
        second_last_name: '',
        email: '',
        password: '',
        role: '',
        phone_number: ''
    };

    dropdownItems = [
        { name: 'Administrador', code: 'Administrador' },
        { name: 'Usuario', code: 'Usuario' },
    ];

    selectedMulti: any[] = [];
    companies: Company[] = [];
    selectedState: { name: string, code: string } | null = null;

    constructor(
        private location: Location,
        private userService: UserService,
        private companyService: CompanyService,
        private userCompanyService: UserCompanyService,
        private messageService: MessageService,
        private encryptionService: EncryptionService
    ) { }

    ngOnInit(): void {
        this.companyService.getCompanies().subscribe({
            next: (companies) => {
                this.companies = companies;
                if (this.companies.length === 0) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontraron empresas.' });
                }
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las empresas.' });
            }
        });
    }

    onGoBack(): void {
        this.location.back();
    }

    onSave(): void {
        const names = this.user.first_name.split(' ');
        const lastNames = this.user.first_last_name.split(' ');
        this.user.first_name = names[0] || '';
        this.user.second_name = names[1] || '';
        this.user.first_last_name = lastNames[0] || '';
        this.user.second_last_name = lastNames[1] || '';
        this.user.role = this.selectedState ? this.selectedState.code : '';
        this.user.password = this.encryptionService.encrypt(this.user.password);

        console.log('Usuario a registrar:', this.user);
        this.userService.createUser(this.user).subscribe({
            next: (createdUser) => {
                this.selectedMulti.forEach(company => {
                    const userCompanyRelation: UserCompany = {
                        user_unique_key: createdUser.unique_key,
                        company_unique_key: company.unique_key
                    };
                    this.userCompanyService.saveUserCompanyRelation(userCompanyRelation).subscribe({
                        next: () => {
                            console.log(`Relación usuario-compañía registrada para usuario: ${createdUser.unique_key}, compañía: ${company.unique_key}`);
                        },
                        error: (error) => {
                            console.error('Error al asociar empresa:', error.message);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al asociar empresa:' });
                            this.createUserDialog = false;
                        }
                    });
                });
                this.messageService.add({ severity: 'success', summary: 'Registrado', detail: 'Usuario Registrado' });
                this.location.back();
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al creaur usuario. Datos Invalidos' });
                this.createUserDialog = false;
                this.user.password = '';
            }
        });
    }

    onClear(): void {
        this.user = {
            first_name: '',
            second_name: '',
            first_last_name: '',
            second_last_name: '',
            email: '',
            password: '',
            role: '',
            phone_number: ''
        };
        this.selectedState = null;
        this.selectedMulti = [];
    }
}
