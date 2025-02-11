import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../../service/location.service';
import { Location } from '@angular/common';
import { Company } from '../../../../api/company.model'
import { Meter } from '../../../../api/meter.model';
import { CompanyService } from '../../../../service/company.service';
import { MeterService } from '../../../../service/meter.service';
import { Gateway } from '../../../../api/gateway.model';
import { GatewayService } from '../../../../service/gateway.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-detail-meter',
    templateUrl: './detailmeter.component.html',
    styleUrls: ['./detailmeter.component.css'],
    providers: [MessageService]
})
export class DetailMeterComponent implements OnInit {

    selectedState: any = null;
    selectedCompany: any = null;
    selectedRegion: any = null;
    selectedTypeProduct: any = null;
    selectedSubRed: any = null;
    selectedGateway: any = null;
    valClassSupport: string = '';
    comunicationCheck: string[] = [];
    typeAutentification: string = '';
    companies: Company[] = [];
    gateways: Gateway[] = [];
    lat: number = -0.345638;
    lng: number = -78.447889;
    companyKey: string = localStorage.getItem('selectedCompanyId');
    meters: Meter[] = [];
    changeMeterDialog: boolean = false;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    data: any;
    optionsCurve: any;

    meter: Meter = {
        name: '',
        dev_eui: '',
        serial: '',
        diameter: '',
        type_communication: '',
        state: false,
        last_reading: 0,
        model: '',
        class_support: '',
        battery_percentage: '',
        last_comunication: '',
        valve_state: '',
        latitude: this.lat,
        longitude: this.lng,
        company_unique_key: '',
        type_product: '',
        sub_red: '',
        app_skey: '',
        app_key: '',
        nwk_skey: '',
        dev_addr: '',
        authentication_type: '',
        eui_aplication: '',
        direction_gprs: '',
        imei: '',
        number_serial: '',
        gateway_unique_key: '',
        region: ''
    };
    dropdownItemsState = [
        { name: 'Activo', code: 'true' },
        { name: 'Inactivo', code: 'false' },
    ];
    dropdownItemsRegion = [
        { name: 'CN470', code: 'CN470' },
        { name: 'CN470PREQUEL', code: 'CN470PREQUEL' },
        { name: 'CN470PHOENIX', code: 'CN470PHOENIX' },
        { name: 'AS923MYS', code: 'AS923MYS' },
        { name: 'EU868', code: 'EU868' },
        { name: 'AS923', code: 'AS923' },
        { name: 'US915', code: 'US915' },
        { name: 'AU915', code: 'AU915' },
        { name: 'EU433', code: 'EU433' },
        { name: 'IN865', code: 'IN865' },
        { name: 'CN470ALID', code: 'CN470ALID' },
        { name: 'CN470ALIS', code: 'CN470ALIS' },
        { name: 'AS923IND', code: 'AS923IND' },
        { name: 'ID920', code: 'ID920' },
        { name: 'KR920', code: 'KR920' },
        { name: 'RU864', code: 'RU864' },
    ];
    dropdownItemsProductType = [
        { name: 'rhf3mr01', code: 'rhf3mr01' },
        { name: 'rhf3m485', code: 'rhf3m485' },
        { name: 'lorawan', code: 'lorawan' },
    ];
    dropdownItemsTypeGateway = [
        { name: 'Wi-Fi', code: 'WIFI' },
        { name: 'Ethernet', code: 'ETH' },
        { name: 'Bluetooth', code: 'BLU' },
        { name: 'Zigbee', code: 'ZIG' }
    ];
    dropdownItemsSubRed = [
        { name: 'Subred A', code: 'A' },
        { name: 'Subred B', code: 'B' },
        { name: 'Subred C', code: 'C' },
        { name: 'Subred D', code: 'D' }
    ];
    labelsX: any;

    cities1: any[] = [];
    cities2: any[] = [];
    city1: any = null;
    city2: any = null;
    selectedCountry: any = null;
    selectedProvince: any = null;
    selectedCity: any = null;
    countries: any[] = [];
    provinces: any[] = [];
    cities: any[] = [];
    stateValve: number = 0;
    zoom = 18;
    center = { lat: this.lat, lng: this.lng };
    mapOptions: google.maps.MapOptions = {
        scrollwheel: true,
        gestureHandling: 'auto',
        zoomControl: true,
    };
    consumos: any[] = [
        { date: new Date('2023-03-01'), consumption: 100 },
        { date: new Date('2023-01-01T09:30:00'), consumption: 120 },
        { date: new Date('2022-02-01'), consumption: 150 },
        { date: new Date('2022-03-01'), consumption: 200 },
        { date: new Date('2022-10-02'), consumption: 180 },
        { date: new Date('2024-03-01'), consumption: 200 },
        { date: new Date('2024-10-15'), consumption: 180 },
        { date: new Date('2023-02-01'), consumption: 150 },
        { date: new Date('2023-03-01'), consumption: 200 },
        { date: new Date('2023-10-02'), consumption: 180 },
        { date: new Date('2024-03-01'), consumption: 200 },
        { date: new Date('2024-10-15'), consumption: 180 },
        { date: new Date('2024-10-16'), consumption: 160 },
        { date: new Date('2024-10-17'), consumption: 220 },
        { date: new Date('2024-11-30'), consumption: 180 },
        { date: new Date('2024-11-28'), consumption: 160 },
        { date: new Date('2024-11-29'), consumption: 220 },
        { date: new Date('2024-11-30T14:00:00'), consumption: 180 },
        { date: new Date('2024-11-30T09:30:00'), consumption: 160 },
        { date: new Date('2024-11-30T18:45:00'), consumption: 220 }
    ];
    startDate: Date | null = null;
    endDate: Date | null = null;
    interval: any = { label: 'Días', value: 'days' };
    compareEndDate: Date | null = null;
    chartData: ChartData;
    chartOptions: ChartOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Tiempo'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Consumo (litros)'
                },
                beginAtZero: true
            }
        }
    };
    filteredData: any[] = [];

    intervalOptions = [
        { label: 'Días', value: 'days' },
        { label: 'Meses', value: 'months' },
        { label: 'Años', value: 'years' }
    ];

    constructor(
        private locationService: LocationService,
        private location: Location,
        private companyService: CompanyService,
        private meterService: MeterService,
        private gatewayService: GatewayService,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.chartData = {
            labels: this.labelsX,
            datasets: [{
                label: 'Consumo',
                data: [],
                fill: false,
                borderColor: '#42A5F5',
                tension: 0.1
            }]
        };
        this.locationService.getCountries().subscribe(data => {
            this.countries = data;
        });
        this.loadCompaniesMeters();
        const meterId = this.route.snapshot.paramMap.get('id');
        if (meterId) {
            this.loadSelectedMeter(meterId);
        }
        this.updateChart();
    }

    onGoBack(): void {
        this.location.back();
    }

    loadCompaniesMeters(): void {
        this.companyService.getCompanies().subscribe(data => {
            this.companies = data;
        });
        this.meterService.getMetersByCompany(this.companyKey).subscribe(data => {
            this.meters = data;
        });
    }

    loadGatewaysByCompany(companyKey: string): void {
        this.gatewayService.getGatewaysByCompany(companyKey).subscribe(data => {
            this.gateways = data;
            this.selectedGateway = this.gateways.find(item => item.unique_key === this.meter.gateway_unique_key);
        });
    }

    loadSelectedMeter(meterId: string): void {
        this.meterService.getMeterById(meterId).subscribe(
            (data: Meter) => {
                this.meter = data;
                console.log(this.meter);
                this.lat = this.meter.latitude;
                this.lng = this.meter.longitude;
                this.center = { lat: this.lat, lng: this.lng };
                this.selectedCompany = this.companies.find(item => item.unique_key === this.meter.company_unique_key);
                this.selectedState = this.dropdownItemsState.find(item => item.code === this.meter.state.toString());
                this.comunicationCheck = this.meter.type_communication.split(', ');
                this.selectedRegion = this.dropdownItemsRegion.find(item => item.name === this.meter.region);
                this.valClassSupport = this.meter.class_support;
                this.selectedTypeProduct = this.dropdownItemsProductType.find(item => item.name === this.meter.type_product);
                this.selectedSubRed = this.dropdownItemsSubRed.find(item => item.name === this.meter.sub_red);
                this.typeAutentification = this.meter.authentication_type;
                this.selectedGateway = this.gateways.find(item => item.unique_key === this.meter.gateway_unique_key);
                console.log(this.gateways);
            },
            error => {
                console.error('Error al cargar el medidor:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el medidor.', life: 3000 });
            }
        );
    }

    openEdit(meter: Meter) {
        this.router.navigate([`/devices/meter/edit-meter/${meter.unique_key}`]);
    }

    updateChart(): void {
        if (this.endDate) {
            this.compareEndDate = new Date(this.endDate);
            this.compareEndDate.setDate(this.compareEndDate.getDate() + 1);
        }
        this.chartData = {
            labels: this.labelsX,
            datasets: [{
                label: 'Consumo',
                data: [],
                fill: false,
                borderColor: '#42A5F5',
                tension: 0.1
            }]
        };
        if (!this.startDate || !this.endDate) {
            return;
        }
        if (this.interval.value === 'days') {
            this.getConsumptionForDays();
        } else if (this.interval.value === 'months') {
            this.getConsumptionForMonths();
        } else if (this.interval.value === 'years') {
            this.getConsumptionForYears();
        }
    }

    getConsumptionForDays(): void {
        this.filteredData = this.consumos.filter(item => {
            const itemDate = item.date;
            return itemDate >= this.startDate && itemDate < this.compareEndDate;
        });
        this.filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (this.startDate.getDay() === this.endDate.getDay()) {
            const labels = [];
            const hoursInDay = 24;
            for (let i = 0; i < hoursInDay; i++) {
                const hour = (i < 10 ? `0${i}` : i) + ":00";
                labels.push(hour);
            }
    
            this.chartData.labels = labels;
    
            const hourlyConsumption: { [key: string]: number } = {};
            this.filteredData.forEach(item => {
                const itemDate = new Date(item.date);
                if (itemDate.getDate() === this.startDate.getDate() &&
                    itemDate.getMonth() === this.startDate.getMonth() &&
                    itemDate.getFullYear() === this.startDate.getFullYear()) {
                    const hourKey = `${itemDate.getHours()}`;
                    if (!hourlyConsumption[hourKey]) {
                        hourlyConsumption[hourKey] = 0;
                    }
                    hourlyConsumption[hourKey] += item.consumption;
                }
            });
            const hourlyData = labels.map(hour => {
                const hourIndex = parseInt(hour.split(":")[0]);
                return hourlyConsumption[hourIndex] || 0;
            });
    
            this.chartData.datasets[0].data = hourlyData;
    
        } else {
            const dailyConsumption: { [key: string]: number } = {};
            this.filteredData.forEach(item => {
                const itemDate = new Date(item.date);
                const dateKey = `${itemDate.getDate()}-${itemDate.getMonth() + 1}-${itemDate.getFullYear()}`;
                if (!dailyConsumption[dateKey]) {
                    dailyConsumption[dateKey] = 0;
                }
                dailyConsumption[dateKey] += item.consumption;
            });
            this.chartData.labels = Object.keys(dailyConsumption).map(dateKey => {
                const [day, month, year] = dateKey.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
                /*const monthName = date.toLocaleString('default', { month: 'short' });
                return `${day} ${monthName} ${dayOfWeek}`;*/
                return `${day} ${dayOfWeek}`;
            });
    
            this.chartData.datasets[0].data = Object.values(dailyConsumption);
        }
    }    

    getConsumptionForMonths(): void {
        this.filteredData = this.consumos.filter(item => {
            const itemYear = item.date.getFullYear();
            const itemMonth = item.date.getMonth();
            const startYear = this.startDate.getFullYear();
            const startMonth = this.startDate.getMonth();
            const endYear = this.endDate.getFullYear();
            const endMonth = this.endDate.getMonth();
            return (itemYear > startYear || (itemYear === startYear && itemMonth >= startMonth)) &&
                (itemYear < endYear || (itemYear === endYear && itemMonth <= endMonth));
        });
    
        this.filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const uniqueMonths = new Set<string>();
        this.chartData.labels = this.filteredData.map(item => {
            const date = new Date(item.date);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
            
            if (!uniqueMonths.has(monthYear)) {
                uniqueMonths.add(monthYear);
                return `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
            }
            return null;
        }).filter(label => label !== null);
        const monthlyConsumption: { [key: string]: number } = {};
        this.filteredData.forEach(item => {
            const date = new Date(item.date);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
            if (!monthlyConsumption[monthYear]) {
                monthlyConsumption[monthYear] = 0;
            }
            monthlyConsumption[monthYear] += item.consumption;
        });
        this.chartData.datasets[0].data = Object.values(monthlyConsumption);
    }    

    getConsumptionForYears(): void {
        const filteredData = this.consumos.filter(item => {
            const itemDate = item.date;
            const startYear = this.startDate.getFullYear();
            const endYear = this.endDate.getFullYear();
            const itemYear = itemDate.getFullYear();
            console.log(itemYear, startYear, endYear);
            return itemYear >= startYear && itemYear <= endYear;
        });
        filteredData.sort((a, b) => new Date(a.date).getFullYear() - new Date(b.date).getFullYear());
        const uniqueYears = new Set<string>();
        this.chartData.labels = filteredData.map(item => {
            const date = new Date(item.date);
            const year = date.getFullYear().toString();
            if (!uniqueYears.has(year)) {
                uniqueYears.add(year);
                return year;
            }
            return null;
        }).filter(label => label !== null);

        const yearlyConsumption: { [key: string]: number } = {};

        filteredData.forEach(item => {
            const date = new Date(item.date);
            date.setUTCHours(0, 0, 0, 0);
            const year = date.getFullYear().toString();

            if (!yearlyConsumption[year]) {
                yearlyConsumption[year] = 0;
            }

            yearlyConsumption[year] += item.consumption;
        });

        this.chartData.datasets[0].data = Object.values(yearlyConsumption);
    }

    exportToCSV(): void {
        let csvContent = "data:text/csv;charset=utf-8,";
        const filteredData = this.consumos.filter(item => {
            const itemDate = item.date;
            return itemDate >= this.startDate && itemDate < this.compareEndDate;
        });
    
        if (this.interval.value === 'days') {
            if (this.startDate.toDateString() === this.endDate.toDateString()) {
                csvContent += "Hora,Consumo\n";
                for (let i = 0; i < filteredData.length; i++) {
                    const hour = filteredData[i].date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    const consumption = filteredData[i].consumption;
                    csvContent += `"${hour}","${consumption}"\n`;
                }
            } else {
                csvContent += "Fecha,Consumo\n";
                const dailyConsumption: { [key: string]: number } = {};
                filteredData.forEach(item => {
                    const dateStr = item.date.toLocaleDateString();
                    if (!dailyConsumption[dateStr]) {
                        dailyConsumption[dateStr] = 0;
                    }
                    dailyConsumption[dateStr] += item.consumption;
                });
                Object.keys(dailyConsumption).forEach(date => {
                    const consumption = dailyConsumption[date];
                    csvContent += `${date},${consumption}\n`;
                });
            }
        } else if (this.interval.value === 'months') {
            csvContent += "Mes,Consumo\n";
            const monthlyData = this.chartData.datasets[0].data;
            for (let i = 0; i < monthlyData.length; i++) {
                const month = this.chartData.labels[i];
                const consumption = monthlyData[i];
                csvContent += `"${month}","${consumption}"\n`;
            }
        } else if (this.interval.value === 'years') {
            csvContent += "Anio,Consumo\n";
            const yearlyData = this.chartData.datasets[0].data;
            for (let i = 0; i < yearlyData.length; i++) {
                const year = this.chartData.labels[i];
                const consumption = yearlyData[i];
                csvContent += `"${year}","${consumption}"\n`;
            }
        }
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'consumo.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }    
}
