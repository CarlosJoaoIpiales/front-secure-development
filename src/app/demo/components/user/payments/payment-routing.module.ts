import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentComponent} from './payment.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PaymentComponent },
        /*{ path: 'new-loan', loadChildren: () => import('./createloan/createloan.module').then(m => m.CreateLoanModule) },*/
    ])],
    exports: [RouterModule]
})
export class PaymentRoutingModule { }
