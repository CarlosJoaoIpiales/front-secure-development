import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [MessageService]
})
export class DashboardComponent implements OnInit {
    userCount: number = 0;

    constructor(
        private userService: UserService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.userService.getUserCount().subscribe(
            (count: number) => {
                this.userCount = count;
            },
            error => {
                console.error('Error fetching user count', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener la cantidad de usuarios', life: 3000 });
            }
        );
    }
}