import { Component, OnInit } from '@angular/core';
import { User } from '../../../api/user.model';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';
import { UserCompanyService } from '../../../service/user-company.service';
import { EventCommunicationService } from '../../../service/event-communication.service';

@Component({
    templateUrl: './user.component.html',
    providers: [MessageService]
})
export class UserComponent implements OnInit {

    userDialog: boolean = false;
    deleteUsersDialog: boolean = false;
    users: User[] = [];
    user: User = {} as User;
    selectedUsers: User[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    roles: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private userService: UserService,
        private userCompanyService: UserCompanyService,
        private messageService: MessageService,
        private router: Router,
        private eventService: EventCommunicationService,
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'unique_key', header: 'Code' },
            { field: 'first_name', header: 'First Name' },
            { field: 'last_name', header: 'Last Name' },
            { field: 'email', header: 'Email' },
            { field: 'role', header: 'Role' },
            { field: 'phone_number', header: 'Phone Number' }
        ];
        this.loadUsersByCompany();
        this.eventService.companyChange$.subscribe(() => {
            this.loadUsersByCompany();
            console.log(this.users);
        });
    }

    loadUsersByCompany() {
        const companyId = localStorage.getItem('selectedCompanyId');
        if (!companyId) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el ID de la compañía en localStorage', life: 3000 });
            this.users = [];
            return;
        }
        this.userCompanyService.getUserByCompanyById(companyId).subscribe({
            next: (userCompanyRelations) => {
                const userIds = userCompanyRelations.map(relation => relation.user_unique_key);
                if (userIds.length === 0) {
                    this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay usuarios registrados para esta compañía', life: 3000 });
                    this.users = [];
                    return;
                }
                this.fetchUsersDetails(userIds);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener la relación de usuarios y compañías', life: 3000 });
            }
        });
    }

    fetchUsersDetails(userIds: string[]) {
        const userDetailsRequests = userIds.map(userId => this.userService.getUserById(userId).toPromise());
        Promise.all(userDetailsRequests)
            .then(users => {
                this.users = users as User[];
            })
            .catch(() => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar todos los detalles de los usuarios', life: 3000 });
                this.users = [];
            });
    }

    openNew() {
        this.router.navigate(['/accounts/user/register-user']);
    }

    deleteSelectedUsers() {
        this.deleteUsersDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteUsersDialog = false;

        const deleteRequests = this.selectedUsers.map(user =>
            this.userCompanyService.deleteByUserId(user.unique_key).toPromise()
        );

        Promise.all(deleteRequests)
            .then(() => {
                this.users = this.users.filter(val => !this.selectedUsers.includes(val));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuarios Eliminados', life: 3000 });
                this.selectedUsers = [];
            })
            .catch(() => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los usuarios seleccionados.' });
            });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    findIndexByUniqueKey(unique_key: string): number {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].unique_key === unique_key) {
                index = i;
                break;
            }
        }
        return index;
    }

    onGlobalFilter(table: any, event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        if (filterValue.includes(' ')) {
            const filteredUsers = this.users.filter(user => {
                const fullName = `${user.first_name} ${user.second_name}`.toLowerCase();
                const fullLastName = `${user.first_last_name} ${user.second_last_name}`.toLowerCase();
                return fullName.includes(filterValue.toLowerCase()) ||
                    fullLastName.includes(filterValue.toLowerCase()) ||
                    user.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.second_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.first_last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.second_last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                    `${user.first_name} ${user.second_name} ${user.first_last_name} ${user.second_last_name}`.toLowerCase().includes(filterValue.toLowerCase());
            });
            table.value = filteredUsers;
        } else {
            table.filterGlobal(filterValue, 'contains');
        }
    }

    openEdit(user: User) {
        this.router.navigate([`/accounts/user/edit-user/${user.unique_key}`]);
    }
}
