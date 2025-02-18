import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MeterService } from '../../../service/meter.service';
import 'chartjs-plugin-datalabels';
import { GatewayService } from '../../../service/gateway.service';
import { EventCommunicationService } from '../../../service/event-communication.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Message } from '../../../api/message.model';
import { MessagesService } from '../../../service/messages.service';

@Component({
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.css'],
    providers: [MessageService],
})
export class UserDashboardComponent implements OnInit, OnDestroy {

    messages: Message[] = [];
    items!: MenuItem[];
    companyUniqueKey = localStorage.getItem('selectedCompanyId');
    metersData: any = [];
    metersOptions: any;
    markerPositions: google.maps.LatLngLiteral[] = [];
    markerOptions: google.maps.MarkerOptions[] = [];
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

    constructor(private layoutService: LayoutService, private meterService: MeterService, private gatewayService: GatewayService, private eventService: EventCommunicationService, private router: Router,  private messageService: MessageService, private messagesService: MessagesService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
                this.getLocationsMeters();
            });
    }

    ngOnInit() {
        this.initChart();
        this.initCharts();
        this.getLocationsMeters();
        this.eventService.companyChange$.subscribe(() => {
            this.reloadComponent();
        });
        this.getMessages();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };

        this.meterService.getMeterStatusCount(this.companyUniqueKey).subscribe(
            (data) => {
                this.totalMeters = data.total_meters;
                this.metersData = {
                    labels: ['Activos: ' + data.active, 'Inactivos: ' + data.inactive],
                    datasets: [
                        {
                            data: [data.active, data.inactive],
                            backgroundColor: [
                                'rgba(59, 162, 245, 0.8)',
                                'rgba(0, 91, 168, 0.8)',
                            ],
                            hoverBackgroundColor: [
                                'rgba(34, 140, 245, 1)',
                                'rgba(29, 113, 184, 1)'
                            ]
                        }
                    ]
                };
                this.metersOptions = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                color: 'black',

                            }
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'center',
                            font: {
                                weight: 'bold',
                                size: 14
                            },
                            formatter: (value: number) => {
                                return value;
                            }
                        }
                    }
                };
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar datos de medidores.' });
            }
        );

        this.gatewayService.getGatewayStatusCount(this.companyUniqueKey).subscribe(
            (data) => {
                this.totalGateways = data.total_gateways;
                this.gatewaysData = {
                    labels: ['Activos: ' + data.active, 'Inactivos: ' + data.inactive],
                    datasets: [
                        {
                            data: [data.active, data.inactive],
                            backgroundColor: [
                                'rgba(59, 162, 245, 0.8)',
                                'rgba(0, 91, 168, 0.8)',
                            ],
                            hoverBackgroundColor: [
                                'rgba(34, 140, 245, 1)',
                                'rgba(29, 113, 184, 1)'
                            ]
                        }
                    ]
                };
                this.gatewaysOptions = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                color: 'black',

                            }
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'center',
                            font: {
                                weight: 'bold',
                                size: 14
                            },
                            formatter: (value: number) => {
                                return value;
                            }
                        }
                    }
                };
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar datos de gateways.' });
            }
        );

        this.lineData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    tension: .4
                }
            ]
        };

        this.lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getLocationsMeters() {
        this.meterService.getMetersLocations(this.companyUniqueKey).subscribe(
            (data) => {
                console.log('Meters locations', data);
                this.metersLocations = data;
                this.addMarkersToMap();
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las locaciones de los medidores.' });
            }
        );
    }

    addMarkersToMap(): void {
        this.markerPositions = this.metersLocations.map((location) => ({
            position: { lat: location.latitude, lng: location.longitude },
            title: location.name
        }));
    }

    reloadPage() {
        window.location.reload()
    }

    reloadComponent()   {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([currentUrl]);
        });
    }

    getMessages() {
        this.messagesService.getAllMessages().subscribe(
            data => {
                this.messages = data;
                console.log('Messages', this.messages);
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo establecer conexion con el servidor', life: 3000 });
            }
        );
    }
}
