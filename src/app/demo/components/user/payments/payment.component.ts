import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GatewayService } from '../../../service/gateway.service';
import { Gateway } from '../../../api/gateway.model';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { EventCommunicationService } from '../../../service/event-communication.service';

@Component({
    templateUrl: './payment.component.html',
    providers: [MessageService],
})
export class PaymentComponent implements OnInit {

    gateways: Gateway[] = [];
    items: MenuItem[] = [];
    cols: any[] = [];
    selectedGateways: Gateway[] = [];
    loading: boolean = true;
    uniqueKeyCompany: string = localStorage.getItem('selectedCompanyId') || '';
    gatewayDialog: boolean = false;
    deleteGatewayDialog: boolean = false;
    deleteGatewaysDialog: boolean = false;
    gateway: Gateway = {} as Gateway;
    submitted: boolean = false;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private gatewayService: GatewayService, 
        private router: Router,
        private messageService: MessageService,
        private eventService: EventCommunicationService,
    ) { }

    ngOnInit() {
        this.getGateways();

        this.eventService.companyChange$.subscribe(() => {
            this.uniqueKeyCompany = localStorage.getItem('selectedCompanyId') || '';
            this.getGateways();
        });
    }

    openNew() {
        this.router.navigate(['/user/loans/new-loan']);
    }

    deleteSelectedGateways() {
        this.deleteGatewaysDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteGatewaysDialog = false;
    
        const deleteRequests = this.selectedGateways.map(gateway =>
            this.gatewayService.deleteGateway(gateway.unique_key).toPromise()
        );
        Promise.all(deleteRequests)
            .then(() => {
                this.gateways = this.gateways.filter(val => !this.selectedGateways.includes(val));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Gateways Eliminados', life: 3000 });
                this.selectedGateways = [];
            })
            .catch(() => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los gateways seleccionados.' });
            });
    }    

    confirmDelete() {
        this.deleteGatewayDialog = false;
        this.gatewayService.deleteGateway(this.gateway.unique_key).subscribe({
            next: () => {
                this.gateways = this.gateways.filter(val => val.unique_key !== this.gateway.unique_key);
                this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Gateway Eliminado', life: 3000 });
                this.gateway = {} as Gateway;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el gateway.' });
            }
        });
    }
    

    hideDialog() {
        this.gatewayDialog = false;
        this.submitted = false;
    }

    findIndexByUniqueKey(unique_key: string): number {
        let index = -1;
        for (let i = 0; i < this.gateways.length; i++) {
            if (this.gateways[i].unique_key === unique_key) {
                index = i;
                break;
            }
        }
        return index;
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openEdit(gateway: Gateway) {
        this.router.navigate([`/devices/gateway/edit-gateway/${gateway.unique_key}`]);
    }

    getGateways() {
        this.gatewayService.getGatewaysByCompany(this.uniqueKeyCompany).subscribe(
            data => {
                this.gateways = data;
                this.loading = false;
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo establecer conexion con el servidor', life: 3000 });
                this.loading = false;
            }
        );
    }
}
