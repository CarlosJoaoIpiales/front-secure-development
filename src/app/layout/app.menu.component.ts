import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/user/dashboard'] }
                ]
            },
            {
                label: 'Servicios',
                items: [
                    { label: 'Cuenta', icon: 'pi pi-fw pi-dollar', routerLink: ['/user/account'] },
                    { label: 'Prestamos', icon: 'pi pi-fw pi-mobile', routerLink: ['/user/loans'] },
                    { label: 'Pagos', icon: 'pi pi-fw pi-bolt', routerLink: ['/user/payments'] },
                    
                ]
            },
            {
                label: 'Usuario',
                items: [
                    { label: 'Perfil', icon: 'pi pi-fw pi-users', routerLink: ['/accounts/user'] },
                ]
            },
        ];
    }
    clearLocalStorageAndLogout() {
        window.location.href = '/auth/login';
    }
}
