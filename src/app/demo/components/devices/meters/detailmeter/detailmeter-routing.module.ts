import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailMeterComponent } from './detailmeter.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DetailMeterComponent },
		{ path: 'edit-meter/:id', loadChildren: () => import('../editmeter/editmeter.module').then(m => m.EditMeterModule) },
	])],
	exports: [RouterModule]
})
export class DetailMeterRoutingModule { }
