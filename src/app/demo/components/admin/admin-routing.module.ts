import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
        { path: 'users', loadChildren: () => import('./manage-users/manage-users.module').then(m => m.ManageUsersModule) },
        /*{ path: 'payments', loadChildren: () => import('./payments/payment.module').then(m => m.PaymentModule) },
        { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
        { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },*/
        { path: '**', redirectTo: '../notfound' }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
