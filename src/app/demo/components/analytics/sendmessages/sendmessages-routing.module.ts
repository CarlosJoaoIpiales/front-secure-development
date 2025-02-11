import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SendMessagesComponent} from './sendmessages.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SendMessagesComponent },
        { path: 'message-detail/:id', loadChildren: () => import('./detailsendmessages/detailsendmessages.module').then(m => m.DetailSendMessagesModule) },
        /*{ path: 'edit-gateway/:id', loadChildren: () => import('./editgateway/editgateway.module').then(m => m.EditGatewayModule) },*/
    ])],
    exports: [RouterModule]
})
export class SendMessagesRoutingModule { }
