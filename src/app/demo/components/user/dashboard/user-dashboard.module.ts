import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDashboardComponent } from './user-dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { UserDashboardsRoutingModule } from './user-dashboard-routing.module';
import { GoogleMapsModule } from "@angular/google-maps";
import { ToastModule } from 'primeng/toast';
import { DataViewModule } from 'primeng/dataview';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        GoogleMapsModule,
        ToastModule,
        UserDashboardsRoutingModule,
        DataViewModule
    ],
    declarations: [UserDashboardComponent]
})
export class UserDashboardModule { }
