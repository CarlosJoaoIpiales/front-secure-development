import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../api/user.model';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    providers: [MessageService]
})
export class ProfileComponent implements OnInit {
    user: User | null = null;

    constructor(
        private readonly userService: UserService,
        private readonly messageService: MessageService
    ) { }

    ngOnInit() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.userService.getUserById(userId).subscribe({
                next: (user: User) => {
                    this.user = user;
                    console.log('User:', this.user);
                },
                error: error => {
                    console.error('Error fetching user data', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los datos del usuario', life: 3000 });
                }
            });
        }
    }
}