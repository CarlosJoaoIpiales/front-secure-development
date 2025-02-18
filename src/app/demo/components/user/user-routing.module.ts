import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'dashboard', loadChildren: () => import('./dashboard/user-dashboard.module').then(m => m.UserDashboardModule) },
        { path: 'loans', loadChildren: () => import('./loans/loan.module').then(m => m.LoanModule) },
        /*{ path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule) },
        { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
        { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },*/
        { path: '**', redirectTo: '../notfound' }
    ])],
    exports: [RouterModule]
})
export class UserRoutingModule { }
