import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoanComponent} from './loan.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LoanComponent },
        { path: 'new-loan', loadChildren: () => import('./createloan/createloan.module').then(m => m.CreateLoanModule) },
    ])],
    exports: [RouterModule]
})
export class LoanRoutingModule { }
