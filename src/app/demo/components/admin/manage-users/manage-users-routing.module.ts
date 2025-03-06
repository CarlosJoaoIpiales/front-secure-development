import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManageUsersComponent } from './manage-users.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ManageUsersComponent }
    ])],
    exports: [RouterModule]
})
export class ManageUsersRoutingModule { }
