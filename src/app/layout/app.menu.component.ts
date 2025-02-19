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
                    { label: 'Prestamos', icon: 'pi pi-fw pi-mobile', routerLink: ['/user/loans'] },
                    { label: 'Pagos de Prestaos', icon: 'pi pi-fw pi-bolt', routerLink: ['/devices/meter'] },
                    
                ]
            },
            {
                label: 'Perfil',
                items: [
                    { label: 'Usuario', icon: 'pi pi-fw pi-users', routerLink: ['/accounts/user'] },
                ]
            },
        ];
    }
    clearLocalStorageAndLogout() {
        window.location.href = '/auth/login';
    }
}
