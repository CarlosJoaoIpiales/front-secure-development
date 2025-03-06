import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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
        private layoutService: LayoutService,
        private router: Router,
        private messageService: MessageService,
        private bankAccountService: BankAccountService,
        private loanService: LoanService
    ) { }

    ngOnInit() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.bankAccountService.getUserBankAccounts(userId).subscribe(
                (accounts: BankAccount[]) => {
                    this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
                },
                error => {
                    console.error('Error fetching bank accounts', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las cuentas bancarias', life: 3000 });
                }
            );

            this.loanService.getLoanCount(userId).subscribe(
                (count: number) => {
                    this.loanCount = count;
                },
                error => {
                    console.error('Error fetching loan count', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener la cantidad de préstamos', life: 3000 });
                }
            );

            this.loanService.getNextPaymentDate(userId).subscribe(
                (date: string) => {
                    this.nextPaymentDate = date;
                },
                error => {
                    console.error('Error fetching next payment date', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener la próxima fecha de pago', life: 3000 });
                }
            );
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