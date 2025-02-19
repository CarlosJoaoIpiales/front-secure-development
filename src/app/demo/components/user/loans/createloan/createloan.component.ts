import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LocationService } from '../../../../service/location.service';
import { Location } from '@angular/common';
import { Company } from '../../../../api/company.model'
import { Meter } from '../../../../api/meter.model';
import { CompanyService } from '../../../../service/company.service';
import { MeterService } from '../../../../service/meter.service';
import { Gateway } from '../../../../api/gateway.model';
import { GatewayService } from '../../../../service/gateway.service';
import { MessageService } from 'primeng/api';
import { Brand } from '../../../../api/brand.model';
import { Model } from '../../../../api/model.model';
import { BrandService } from '../../../../service/brand.service';

@Component({
    selector: 'app-new-loan',
    templateUrl: './createloan.component.html',
    styleUrls: ['./createloan.component.css'],
    providers: [MessageService]
})
export class CreateLoanComponent {

    amount: number = 0;
    selectedState: any = null;
    selectedCompany: any = null;
    selectedRegion: any = null;
    selectedTypeProduct: any = null;
    selectedSubRed: any = null;
    selectedGateway: any = null;
    selectedDiameter: any = null;
    selectedBrand: any = null;
    selectedModel: any = null;
    valClassSupport: string = '';
    comunicationCheck: string[] = [];
    typeAutentification: string = '';
    companies: Company[] = [];
    gateways: Gateway[] = [];
    lat: number = -0.345638;
    lng: number = -78.447889;
    companyKey: string = localStorage.getItem('selectedCompanyId');
    meters: Meter[] = [];
    createMeterDialog: boolean = false;
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
    brand: Brand = {
        name: '',
        unique_key: '',
        models: []
    };
    model: Model = {
        name: '',
        unique_key: '',
        brand: this.brand
    }
    dropdownItemsState = [
        { name: 'Activo', code: 'true' },
        { name: 'Inactivo', code: 'false' },
    ];
    dropdownBrandMeter: Brand [] = [];
    dropdownModelMeter: Model [] = [];
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

    constructor(
        private locationService: LocationService,
        private location: Location,
        private companyService: CompanyService,
        private meterService: MeterService,
        private gatewayService: GatewayService,
        private messageService: MessageService,
        private brandService: BrandService
    ) { }

    ngOnInit(): void {
        this.locationService.getCountries().subscribe(data => {
            this.countries = data;
        });
        this.brandService.getAllBrands().subscribe(data => {
            this.dropdownBrandMeter = data;
        });
        this.loadCompaniesMeters();
    }

    onGoBack(): void {
        this.location.back();
    }

    onSave(): void {
        if (!this.validateRequiredFields()) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Faltan rellenar algunos campos.' });
            this.createMeterDialog = false;
            return;
        }
        if (this.selectedState) {
            this.meter.state = this.selectedState.code === 'true';
        }
        if (this.selectedBrand) {
            if (this.selectedModel) {
                this.meter.model = this.selectedModel.name;
            }
        }
        if (this.selectedDiameter) {
            this.meter.diameter = this.selectedDiameter.code;
        }
        this.meter.type_communication = this.comunicationCheck.join(', ');
        if (this.selectedCompany) {
            this.meter.company_unique_key = this.selectedCompany.unique_key;
        }
        if (this.valClassSupport) {
            this.meter.class_support = this.valClassSupport;
        }
        if (this.selectedRegion) {
            this.meter.region = this.selectedRegion.name;
        }
        if (this.selectedTypeProduct) {
            this.meter.type_product = this.selectedTypeProduct.name;
        }
        if (this.selectedSubRed) {
            this.meter.sub_red = this.selectedSubRed.name;
        }
        if (this.typeAutentification) {
            this.meter.authentication_type = this.typeAutentification;
        }
        if (this.selectedGateway) {
            this.meter.gateway_unique_key = this.selectedGateway.unique_key;
        }
        this.meter.serial = this.meter.name;
        console.log(this.meter);
        this.meterService.saveMeter(this.meter).subscribe(
            response => {
                this.location.back();
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el medidor.' });
                this.createMeterDialog = false;
                console.error(error);
            }
        );
    }

    onClear(): void {
        this.selectedState = null;
        this.selectedBrand = null;
        this.selectedModel = null;
        this.typeAutentification = null;
        this.selectedCountry = null;
        this.selectedProvince = null;
        this.selectedCity = null;
        this.lat = null;
        this.lng = null;
    }

    loadCompaniesMeters(): void {
        this.companyService.getCompanies().subscribe(
            data => {
                this.companies = data;
            },
            error => {
                console.error('Error al obtener las compañías', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener las compañías.' });
            }
        );

        this.loadGatewaysByCompany();

        this.meterService.getMetersByCompany(this.companyKey).subscribe(
            data => {
                this.meters = data;
            },
            error => {
                console.error('Error al obtener los medidores', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener los medidores.' });
            }
        );
    }

    loadGatewaysByCompany(): void {
        if (this.selectedCompany && this.selectedCompany.unique_key) {
            this.gatewayService.getGatewaysByCompany(this.selectedCompany.unique_key).subscribe(data => {
                this.gateways = data;
            });
        } else {
            this.gateways = [];
            console.warn('selectedCompany es null o no tiene un unique_key válido.');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Gateway no válido.' });
        }
    }

    validateRequiredFields(): boolean {
        if (!this.meter.dev_eui) {
            return false;
        }
        if (this.comunicationCheck.includes('LoRaWAN') && !this.valClassSupport && !this.valClassSupport && !this.selectedRegion && !this.selectedTypeProduct && !this.selectedSubRed) {
            return false;
        }
        if (this.typeAutentification.includes('OTA') && !this.meter.app_key) {
            return false;
        }
        if (this.typeAutentification.includes('ABP') && !this.meter.dev_addr && !this.meter.app_skey && !this.meter.nwk_skey) {
            return false;
        }
        if (this.comunicationCheck.includes('GPRS') && !this.meter.serial && !this.meter.direction_gprs) {
            return false;
        }
        if (this.comunicationCheck.includes('NB-IoT') && !this.meter.imei) {
            return false;
        }
        if (this.comunicationCheck.includes('Mbus') && !this.selectedGateway && !this.meter.number_serial) {
            return false;
        }
        return true;
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
