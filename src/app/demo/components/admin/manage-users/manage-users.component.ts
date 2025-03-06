import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserService } from '../../../service/user.service';
import { User } from '../../../api/user.model';

@Component({
    templateUrl: './manage-users.component.html',
    styleUrls: ['./manage-users.component.css'],
    providers: [MessageService],
})
export class ManageUsersComponent implements OnInit, OnDestroy {
    users: User[] = [];
    subscription!: Subscription;

    constructor(
        private router: Router,
        private userService: UserService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.subscription = this.userService.getUsers().subscribe(
            (users: User[]) => {
                this.users = users;
                console.log('Users:', this.users);
            },
            error => {
                console.error('Error fetching users', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los usuarios', life: 3000 });
            }
        );
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