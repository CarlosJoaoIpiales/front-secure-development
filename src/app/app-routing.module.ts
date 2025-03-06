import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: '/auth/login', pathMatch: 'full' }, 
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: 'user', loadChildren: () => import('./demo/components/user/user.module').then(m => m.UserModule), canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'USER' } },
                    { path: 'admin', loadChildren: () => import('./demo/components/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'ADMIN' } },
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}