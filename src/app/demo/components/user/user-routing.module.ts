import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'dashboard', loadChildren: () => import('./dashboard/user-dashboard.module').then(m => m.UserDashboardModule) },
        { path: 'loans', loadChildren: () => import('./loans/loan.module').then(m => m.LoanModule) },
        { path: 'payments', loadChildren: () => import('./payments/payment.module').then(m => m.PaymentModule) },
        { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
        { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
        { path: '**', redirectTo: '../notfound' }
    ])],
    exports: [RouterModule]
})
export class UserRoutingModule { }
