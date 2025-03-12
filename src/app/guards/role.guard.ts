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
        console.log('Expected role: ' + expectedRole);
        console.log('Current role: ' + currentRole);
        if (currentRole === expectedRole) {
            return true;
        } else {
            this.router.navigate(['/notfound']);
            return false;
        }
    }
}