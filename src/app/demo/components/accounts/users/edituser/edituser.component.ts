import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../api/user.model';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { CompanyService } from '../../../../service/company.service';
import { Company } from '../../../../api/company.model';
import { UserCompanyService } from '../../../../service/user-company.service';
import { UserCompany } from '../../../../api/user-company.model';
import { EventCommunicationService } from '../../../../service/event-communication.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edituser.component.html',
    styleUrls: ['./edituser.component.css'],
    providers: [MessageService]
})
export class EditUserComponent implements OnInit {

    changeUserDialog: boolean = false;
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

    names: String = '';
    lastNames: String = '';
    dropdownItems = [
        { name: 'Administrador', code: 'Administrador' },
        { name: 'Usuario', code: 'Usuario' },
    ];

    selectedMulti: Company[] = [];
    companies: Company[] = [];
    selectedState: { name: string, code: string } | null = null;
    selectedRole: any[] = [];

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private location: Location,
        private companyService: CompanyService,
        private userCompanyService: UserCompanyService,
        private eventService: EventCommunicationService,
    ) { }

    ngOnInit(): void {
        const userId = this.route.snapshot.paramMap.get('id');
        if (userId) {
            this.loadUser(userId);
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los datos del usuario.' });
        }
        this.loadCompanies();
    }

    loadUser(id: string): void {
        this.userService.getUserById(id).subscribe({
            next: (response) => {
                this.user = response;
                this.selectedState = this.dropdownItems.find(item => item.code === this.user.role) || null;
                this.loadUserCompanies(id);
                this.names = this.user.first_name + ' ' + this.user.second_name;
                this.lastNames = this.user.first_last_name + ' ' + this.user.second_last_name;
            },
            error: (err) => {
                console.error('Error al cargar el usuario:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los datos del usuario. Intentelo más tarde' });
            }
        });
    }

    loadCompanies(): void {
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

    loadUserCompanies(userId: string): void {
        this.userCompanyService.getUserCompanies(userId).subscribe({
            next: (userCompanies) => {
                const userCompanyKeys = userCompanies.map(relation => relation.company_unique_key);
                this.selectedMulti = this.companies.filter(company => 
                    userCompanyKeys.includes(company.unique_key)
                );
                console.log("Compañías seleccionadas:", this.selectedMulti);
            },
            error: (error) => {
                console.error('Error al cargar empresas del usuario:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las empresas del usuario.' });
            }
        });
    }

    onGoBack(): void {
        this.location.back();
    }

    onSave() {
        this.changeUserDialog = false;
        if (!this.user.first_name || !this.user.email || !this.user.role) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Completa todos los campos obligatorios.' });
            return;
        }
        const name = this.names.split(' ');
        const lastName = this.lastNames.split(' ');
        this.user.password = this.user.password;
        this.user.first_name = name[0] || '';
        this.user.second_name = name[1] || '';
        this.user.first_last_name = lastName[0] || '';
        this.user.second_last_name = lastName[1] || '';
        const userId = this.user.unique_key;
        const userOperation = userId 
            ? this.userService.updateUser(userId, this.user) 
            : this.userService.createUser(this.user);
        console.log('Usuario a registrar:', this.user);
        userOperation.subscribe({
            next: (user) => {
                this.saveUserCompanyRelations(user.unique_key).subscribe({
                    next: () => {
                        console.log('usuario guardado');
                        this.eventService.emitSaveUser();
                        this.changeUserDialog = false;
                    },
                    error: (error) => {
                        console.error('Error al guardar relaciones usuario-compañía:', error);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar relaciones usuario-compañía.' });
                        this.changeUserDialog = false;
                    }
                });
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el usuario.' });
                console.error('Error al guardar el usuario:', error);
                this.changeUserDialog = false;
            }
        });
        this.location.back();
    }
    

    saveUserCompanyRelations(unique_key: string): Observable<void> {
        return new Observable<void>((observer) => {
            this.userCompanyService.getUserCompanies(unique_key).subscribe({
                next: (currentRelations: UserCompany[]) => {
                    const currentCompanyKeys = currentRelations.map(relation => relation.company_unique_key);
                    const selectedCompanyKeys = this.selectedMulti.map(company => company.unique_key);
    
                    const companiesToAdd = this.selectedMulti.filter(company =>
                        !currentCompanyKeys.includes(company.unique_key)
                    );
                    const relationsToRemove = currentRelations.filter(relation =>
                        !selectedCompanyKeys.includes(relation.company_unique_key)
                    );
    
                    const addOperations = companiesToAdd.map(company => {
                        const userCompanyRelation: UserCompany = {
                            user_unique_key: unique_key,
                            company_unique_key: company.unique_key
                        };
                        return this.userCompanyService.saveUserCompanyRelation(userCompanyRelation).pipe(catchError((error) => {
                            console.error('Error al asociar empresa:', error.message);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al asociar empresa.' });
                            this.changeUserDialog = false;
                            return of(null); 
                        }));
                    });
    
                    const removeOperations = relationsToRemove.map(relation => {
                        return this.userCompanyService.deleteUserCompanyRelation(relation.unique_key!).pipe(catchError((error) => {
                            console.error('Error al eliminar empresa:', error.message);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar empresa.' });
                            this.changeUserDialog = false;
                            return of(null);
                        }));
                    });
                    forkJoin([...addOperations, ...removeOperations]).subscribe({
                        next: () => {
                            console.log('Todas las relaciones usuario-compañía procesadas.');
                            this.changeUserDialog = false;
                            observer.next();
                            observer.complete();
                        },
                        error: (error) => {
                            console.error('Error al procesar relaciones usuario-compañía:', error);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al procesar relaciones usuario-compañía.' });
                            observer.error(error);
                            this.changeUserDialog = false;
                        }
                    });
                },
                error: (error) => {
                    console.error('Error al obtener relaciones actuales:', error.message);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener relaciones actuales.' });
                    observer.error(error);
                    this.changeUserDialog = false;
                }
            });
        });
    }

    onClear(): void {
        const userId = this.route.snapshot.paramMap.get('id');
        this.loadUser(userId);
        this.loadCompanies();
    }
}
