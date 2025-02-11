import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Message } from '../../../../api/message.model';
import { MessagesService } from '../../../../service/messages.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './detailsendmessages.component.html',
    providers: [MessageService],
})
export class DetailSendMessagesComponent implements OnInit {

    messages: Message[] = [];
    items: MenuItem[] = [];
    cols: any[] = [];
    loading: boolean = true;
    uniqueKeyCompany: string = localStorage.getItem('selectedCompanyId') || '';
    gatewayDialog: boolean = false;
    deleteGatewayDialog: boolean = false;
    deleteGatewaysDialog: boolean = false;
    submitted: boolean = false;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private location: Location,
        private messagesService: MessagesService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'unique_key', header: 'Code' },
            { field: 'serial', header: 'Serial' },
            { field: 'name', header: 'Name' },
        ];
        const messageId = this.route.snapshot.paramMap.get('id');
        console.log('id', messageId);
        this.messagesService.getMessageById(messageId)
            .subscribe({
                next: (message: Message) => {
                    this.messages = [message];
                    this.loading = false;
                    console.log('Mensaje cargado:', message);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Hubo un problema al cargar los datos',
                        life: 3000
                    });
                    this.loading = false;
                }
            });
    }

    onGoBack(): void {
        this.location.back();
    }
}
