import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { Consumption } from '../../../api/consumption.model'
import { BrandService } from '../../../service/brand.service';
import { Brand } from '../../../api/brand.model';
import { Model } from '../../../api/model.model';

@Component({
    selector: 'app-consumption',
    templateUrl: './consumption.component.html',
    styleUrls: ['./consumption.component.css'],
    providers: [MessageService]
})
export class ConsumptionComponent implements OnInit {

    selectedBrand: any = null;
    selectedModel: any = null;
    selectedDiameter: any = null;
    index: number = 0;
    companyKey: string = localStorage.getItem('selectedCompanyId');
    changeMeterDialog: boolean = false;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    data: any;
    optionsCurve: any;
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
    dropdownItemsDiameter = [
        { name: '15', code: '15' },
        { name: '20', code: '20' },
        { name: '25', code: '25' },
        { name: '40', code: '40' },
        { name: '50', code: '50' },
        { name: 'DN50', code: 'DN50' },
        { name: 'DN65', code: 'DN65' },
        { name: 'DN80', code: 'DN80' },
        { name: 'DN100', code: 'DN100' },
        { name: 'DN125', code: 'DN125' },
        { name: 'DN150', code: 'DN150' },
        { name: 'DN200', code: 'DN200' },
        { name: 'DN250', code: 'DN250' },
        { name: 'DN300', code: 'DN300' },
        { name: 'DN400', code: 'DN400' }
    ];
    labelsX: string[] = [];
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
                    text: 'Consumo (m³)'
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
    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    consumptionData = [
        { number: 1, date: '2024-12-01', total_consumption: 150.5 },
        { number: 2, date: '2024-12-02', total_consumption: 180.7 },
        { number: 3, date: '2024-12-03', total_consumption: 200.3 },
        { number: 4, date: '2024-12-04', total_consumption: 170.2 },
        { number: 5, date: '2024-12-04', total_consumption: 170.2 },
        { number: 6, date: '2024-12-04', total_consumption: 170.2 },
        { number: 7, date: '2024-11-04', total_consumption: 170.2 },
        { number: 8, date: '2025-02-04', total_consumption: 170.2 },
        { number: 9, date: '2025-03-04', total_consumption: 17047.2 },
        { number: 10, date: '2025-03-04', total_consumption: 10.2 },
        { number: 11, date: '2025-03-04', total_consumption: 120.2 }
    ];

    consumption: Consumption = null;

    dropdownBrandMeter: Brand[] = [];
    dropdownModelMeter: Model[] = [];

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private router: Router,
        private brandService: BrandService
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
        this.updateChart();
        this.brandService.getAllBrands().subscribe(data => {
            this.dropdownBrandMeter = data;
        });
    }

    onGoBack(): void {
        this.location.back();
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
                const monthName = date.toLocaleString('default', { month: 'short' });
                return `${day} ${monthName} ${dayOfWeek}`;
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

    cleanFilters(): void {
        this.selectedBrand = null;
        this.selectedModel = null;
        this.selectedDiameter = null;
        this.startDate = null;
        this.endDate = null;
        this.compareEndDate = null;
        this.updateChart();
    }

    updateTableAndChartForDays(): void {
        console.log('updateTableChart');
    }

    updateTableAndChartForMonths(): void {
        console.log('updateTableChart');
    }

    updateTableAndChartForYears(): void {
        console.log('updateTableChart');
    }

    onTabChange(e) {
        if (this.index === 0) {
            this.updateTableAndChartForDays();
        } else if (this.index === 1) {
            this.updateTableAndChartForMonths();
        } else if (this.index === 2) {
            this.updateTableAndChartForYears();
        }
    }

    loadModelsByBrand(): void {
        if (this.selectedBrand && this.selectedBrand.unique_key) {
            this.dropdownBrandMeter.forEach(brand => {
                if (brand.unique_key === this.selectedBrand.unique_key) {
                    this.dropdownModelMeter = brand.models;
                }
            });
        } else {
            this.dropdownModelMeter = [];
            console.warn('selectedBrand es null o no tiene un unique_key válido.');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Modelo no válido.' });
        }
    }
}
