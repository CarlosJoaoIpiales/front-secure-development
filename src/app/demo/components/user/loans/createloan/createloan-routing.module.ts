import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateLoanComponent } from './createloan.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CreateLoanComponent }
    ])],
    exports: [RouterModule]
})
export class CreateLoanRoutingModule { }
