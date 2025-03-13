import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './../demo/service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private readonly authService: AuthService, private readonly router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const expectedRole = route.data['expectedRole'];
        const currentRole = this.authService.getUserRole();
        const isAuthenticated = this.authService.isAuthenticated();

        console.log('Expected role: ' + expectedRole);
        console.log('Current role: ' + currentRole);
        console.log('Is authenticated: ' + isAuthenticated);

        if (isAuthenticated && currentRole === expectedRole) {
            return true;
        } else if (!isAuthenticated && state.url === '/auth/login') {
            return true;
        } else {
            this.router.navigate(['/notfound']);
            return false;
        }
    }
}