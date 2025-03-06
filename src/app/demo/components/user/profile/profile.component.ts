import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../api/user.model';
import { MessageService } from 'primeng/api';
import { co } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [MessageService]
})
export class ProfileComponent implements OnInit {
    user: User | null = null;

    constructor(
        private userService: UserService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.userService.getUserById(userId).subscribe(
                (user: User) => {
                    this.user = user;
                    console.log('User:', this.user);
                },
                error => {
                    console.error('Error fetching user data', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los datos del usuario', life: 3000 });
                }
            );
        }
    }
}