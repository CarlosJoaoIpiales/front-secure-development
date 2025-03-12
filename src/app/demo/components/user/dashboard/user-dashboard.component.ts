import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
import { BankAccountService } from '../../../service/bank-account.service';
import { LoanService } from '../../../service/loan.service';
import { BankAccount } from '../../../api/bank-account.model';

@Component({
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.css'],
    providers: [MessageService],
})
export class UserDashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];
    companyUniqueKey = localStorage.getItem('selectedCompanyId');
    metersData: any = [];
    metersOptions: any;
    metersLocations: any = [];
    totalMeters: number;
    gatewaysData: any = [];
    gatewaysOptions: any;
    totalGateways: number;
    barOptions: any;
    lat: number = -0.345638;
    lng: number = -78.447889;
    zoom = 10;
    center = { lat: this.lat, lng: this.lng };
    mapOptions: google.maps.MapOptions = {
        scrollwheel: true,
        gestureHandling: 'auto',
        zoomControl: true,
    };
    barData: any;
    lineData: any;
    lineOptions: any;
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    totalBalance: number = 0;
    loanCount: number | null = null;
    nextPaymentDate: string | null = null;

    constructor(
        private readonly layoutService: LayoutService,
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly bankAccountService: BankAccountService,
        private readonly loanService: LoanService
    ) { }

    ngOnInit() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.bankAccountService.getUserBankAccounts(userId).subscribe({
                next: (accounts: BankAccount[]) => {
                    this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
                },
                error: error => {
                    console.error('Error fetching bank accounts', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las cuentas bancarias', life: 3000 });
                }
            });

            this.loanService.getLoanCount(userId).subscribe({
                next: (count: number) => {
                    this.loanCount = count;
                },
                error: error => {
                    console.error('Error fetching loan count', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener la cantidad de préstamos', life: 3000 });
                }
            });

            this.loanService.getNextPaymentDate(userId).subscribe({
                next: (date: string) => {
                    this.nextPaymentDate = date;
                },
                error: error => {
                    console.error('Error fetching next payment date', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener la próxima fecha de pago', life: 3000 });
                }
            });
        }
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