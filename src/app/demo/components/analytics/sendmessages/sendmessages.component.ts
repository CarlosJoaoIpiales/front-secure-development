import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { EventCommunicationService } from '../../../service/event-communication.service';
import { Message } from '../../../api/message.model';
import { DatePipe } from '@angular/common';
import { MessagesService } from '../../../service/messages.service';

@Component({
    templateUrl: './sendmessages.component.html',
    providers: [MessageService, DatePipe],
})
export class SendMessagesComponent implements OnInit {

    messages: Message[] = [];
    items: MenuItem[] = [];
    cols: any[] = [];
    loading: boolean = true;
    uniqueKeyCompany: string = localStorage.getItem('selectedCompanyId') || '';
    message: any[] = [];
    submitted: boolean = false;
    selectedMessages: Message[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;
    filteredMessages: Message[] = [];
    data: Message[] = [];

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private eventService: EventCommunicationService,
        private datePipe: DatePipe,
        private messagesService: MessagesService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'number', header: 'Number' },
            { field: 'name', header: 'Name' },
            { field: 'type_message', header: 'Type Message' },
            { field: 'decoded_value', header: 'Decoded Value' },
            { field: 'gateway', header: 'Gateway' },
            { field: 'date', header: 'Date' }
        ];
        this.getMessages();

        this.eventService.companyChange$.subscribe(() => {
            this.uniqueKeyCompany = localStorage.getItem('selectedCompanyId') || '';
            this.getMessages();
        });
        this.messages = this.data;
        
        this.filteredMessages = [...this.messages];
    }

    hideDialog() {
        this.submitted = false;
    }

    findIndexByUniqueKey(number: number): number {
        let index = -1;
        for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].app_id === number) {
                index = i;
                break;
            }
        }
        return index;
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openDetail(message: Message) {
        this.router.navigate([`/analytics/sendMessages/message-detail/${message.unique_key}`]);
    }

    getMessages() {
        this.messagesService.getAllMessages().subscribe(
            data => {
                this.messages = data;
                this.loading = false;
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo establecer conexion con el servidor', life: 3000 });
                this.loading = false;
            }
        );
    }

    updateTable() {
        this.getMessages();
    }

    filterByDateRange() {
        this.messages = this.data;
        if (this.startDate && this.endDate) {
            this.filteredMessages = this.messages.filter(message => {
                const messageDate = new Date(message.created_at);
                this.endDate.setHours(23, 59, 59, 999)
                return messageDate >= this.startDate && messageDate <= this.endDate;
            });
            this.messages = this.filteredMessages;
        }else{
            this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'No se ha seleccionado ningún rango de fecha.' });
        }	
    }

    clearFilters() {
        this.startDate = null;
        this.endDate = null;
        this.filteredMessages = [...this.messages];
        this.messages = this.data;
    }

    formatDate(date: Date): string {
        return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss') || '';
    }
}
