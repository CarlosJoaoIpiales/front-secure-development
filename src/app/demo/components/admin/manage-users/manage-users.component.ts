import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserService } from '../../../service/user.service';
import { User } from '../../../api/user.model';

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.component.html',
    providers: [MessageService],
})
export class ManageUsersComponent implements OnInit, OnDestroy {
    users: User[] = [];
    subscription!: Subscription;

    constructor(
        private readonly router: Router,
        private readonly userService: UserService,
        private readonly messageService: MessageService
    ) { }

    ngOnInit() {
        this.subscription = this.userService.getUsers().subscribe({
            next: (users: User[]) => {
                this.users = users;
                console.log('Users:', this.users);
            },
            error: error => {
                console.error('Error fetching users', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los usuarios', life: 3000 });
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    reloadPage() {
        window.location.reload();
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
    }
}
