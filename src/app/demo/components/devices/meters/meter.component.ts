import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MeterService } from '../../../service/meter.service';
import { Meter } from '../../../api/meter.model';
import { Router } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { EventCommunicationService } from '../../../service/event-communication.service';
import * as Papa from 'papaparse';
import { FileUpload } from 'primeng/fileupload';

@Component({
    templateUrl: './meter.component.html',
    providers: [MessageService],
})
export class MeterComponent implements OnInit {

    @ViewChild('fileUpload') fileUpload: FileUpload;
    meters: Meter[] = [];
    items: MenuItem[] = [];
    cols: any[] = [];
    selectedMeters: Meter[] = [];
    loading: boolean = true;
    uniqueKeyCompany: string = localStorage.getItem('selectedCompanyId') || '';
    meterDialog: boolean = false;
    deleteMetersDialog: boolean = false;
    meter: Meter = {} as Meter;
    submitted: boolean = false;
    dialogTableVisible: boolean = false;
    importMeters: Meter[] = [];
    private csvFile: File | null = null;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private meterService: MeterService,
        private router: Router,
        private messageService: MessageService,
        private eventService: EventCommunicationService,
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'unique_key', header: 'Unique Key' },
            { field: 'name', header: 'Name' },
            { field: 'dev_eui', header: 'Device EUI' },
            { field: 'serial', header: 'Serial' },
            { field: 'diameter', header: 'Diameter' },
            { field: 'created_at', header: 'Created At' },
            { field: 'type_communication', header: 'Type of Communication' },
            { field: 'state', header: 'State' },
            { field: 'last_reading', header: 'Last Reading' },
            { field: 'model', header: 'Model' },
            { field: 'class_support', header: 'Class Support' },
            { field: 'battery_percentage', header: 'Battery Percentage' },
            { field: 'last_comunication', header: 'Last Communication' },
            { field: 'valve_state', header: 'Valve State' },
            { field: 'latitude', header: 'Latitude' },
            { field: 'longitude', header: 'Longitude' },
            { field: 'company_unique_key', header: 'Company Unique Key' },
            { field: 'type_product', header: 'Type of Product' },
            { field: 'sub_red', header: 'Sub Red' },
            { field: 'app_skey', header: 'App Skey' },
            { field: 'app_key', header: 'App Key' },
            { field: 'nwk_skey', header: 'NWK Skey' },
            { field: 'dev_addr', header: 'Device Address' },
            { field: 'direction_gprs', header: 'GPRS Direction' },
            { field: 'authentication_type', header: 'Authentication Type' },
            { field: 'eui_aplication', header: 'EUI Application' },
            { field: 'imei', header: 'IMEI' },
            { field: 'number_serial', header: 'Number Serial' },
            { field: 'gateway_unique_key', header: 'Gateway Unique Key' },
            { field: 'region', header: 'Region' },
        ];

        this.getMeters();

        this.eventService.companyChange$.subscribe(() => {
            this.uniqueKeyCompany = localStorage.getItem('selectedCompanyId') || '';
            this.getMeters();
        });
    }

    openNew() {
        this.router.navigate(['/devices/meter/register-meter']);
    }

    deleteSelectedMeters() {
        this.deleteMetersDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteMetersDialog = false;

        const deleteRequests = this.selectedMeters.map(meter =>
            this.meterService.deleteMeterById(meter.unique_key).toPromise()
        );

        Promise.all(deleteRequests)
            .then(() => {
                this.meters = this.meters.filter(val => !this.selectedMeters.includes(val));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Medidores Eliminados', life: 3000 });
                this.selectedMeters = [];
            })
            .catch(() => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los medidores seleccionados.' });
            });
    }


    hideDialog() {
        this.meterDialog = false;
        this.submitted = false;
    }

    findIndexByUniqueKey(unique_key: string): number {
        let index = -1;
        for (let i = 0; i < this.meters.length; i++) {
            if (this.meters[i].unique_key === unique_key) {
                index = i;
                break;
            }
        }
        return index;
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getMeters() {
        this.meterService.getMetersByCompany(this.uniqueKeyCompany).subscribe(
            data => {
                this.meters = data;
                this.loading = false;
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo establecer conexion con el servidor', life: 3000 });
                this.loading = false;
            }
        );
    }

    goToDetail(meter: Meter) {
        this.router.navigate([`/devices/meter/detail-meter/${meter.unique_key}`]);
    }

    showTable() {
        this.dialogTableVisible = true;
    }

    handleFileSelect(event: any) {
        this.csvFile = event.files[0];
        if (this.csvFile) {
            Papa.parse(this.csvFile, {
                complete: (result) => {
                    const metersData: Meter[] = result.data.map((row: any) => ({
                        unique_key: row['Unique Key'],
                        name: row['Name'],
                        dev_eui: row['Device EUI'],
                        serial: row['Serial'],
                        diameter: row['Diameter'],
                        created_at: row['Created At'],
                        state: row['State'] === 'true',
                        type_communication: row['Type of Communication'],
                        last_reading: parseFloat(row['Last Reading']) || 0,
                        model: row['Model'],
                        class_support: row['Class Support'],
                        battery_percentage: row['Battery Percentage'],
                        last_comunication: row['Last Communication'] || null,
                        valve_state: row['Valve State'],
                        latitude: parseFloat(row['Latitude']) || 0,
                        longitude: parseFloat(row['Longitude']) || 0,
                        company_unique_key: row['Company Unique Key'],
                        type_product: row['Type of Product'],
                        sub_red: row['Sub Red'],
                        app_skey: row['App Skey'],
                        app_key: row['App Key'],
                        nwk_skey: row['NWK Skey'],
                        dev_addr: row['Device Address'],
                        direction_gprs: row['GPRS Direction'],
                        authentication_type: row['Authentication Type'],
                        eui_aplication: row['EUI Application'],
                        imei: row['IMEI'],
                        number_serial: row['Number Serial'],
                        gateway_unique_key: row['Gateway Unique Key'],
                        region: row['Region'],
                    }));
                    this.importMeters = metersData;
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Datos importados correctamente', life: 3000 });
                },
                header: true,
                skipEmptyLines: true
            });
        }
    }

    saveImportedMeters() {
        this.dialogTableVisible = false;
        this.fileUpload.clear();
        this.meterService.uploadCSV(this.csvFile).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Medidores guardados correctamente',
                    life: 3000
                });
                this.importMeters = response;
                this.getMeters();
                this.csvFile = null;
                this.importMeters = [];
            },
            (error) => {
                console.error(error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Hubo un problema al guardar los datos',
                    life: 3000
                });
                this.csvFile = null;
                this.importMeters = [];
            }
        );
    }
}
