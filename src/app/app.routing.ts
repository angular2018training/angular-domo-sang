import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AuthGuardService } from './core/services/auth-guard.service';
import { MainPageComponent } from './core/components/main-page/main-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/system/login', pathMatch: 'full'
  
  },
  {
    path: '',
    component: MainPageComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'projects-management', canActivateChild: [AuthGuardService], loadChildren: './modules/projects-management/projects-management.module#ProjectsManagementModule' },
      { path: 'user-management', canActivateChild: [AuthGuardService], loadChildren: './modules/user-management/user-management.module#UserManagementModule' },
      { path: 'client-management', canActivateChild: [AuthGuardService], loadChildren: './modules/client-management/client-management.module#ClientManagementModule' },
      { path: 'client-configuration', canActivateChild: [AuthGuardService], loadChildren: './modules/client-configuration/client-configuration.module#ClientConfigurationModule' },
      { path: 'user-detail', canActivateChild: [AuthGuardService], loadChildren: './modules/user-detail/user-detail.module#UserDetailModule' },
      { path: 'administrator-management', canActivateChild: [AuthGuardService], loadChildren: './modules/admin-management/admin-management.module#AdminManagementModule' },
      { path: 'administrator', canActivateChild: [AuthGuardService], loadChildren: './modules/admin-management/admin-management.module#AdminManagementModule' },
      { path: 'system-configuration', canActivateChild: [AuthGuardService], loadChildren: './modules/system-configuration/system-configuration.module#SystemConfigurationModule' },
      { path: 'tenant-management', canActivateChild: [AuthGuardService], loadChildren: './modules/tenant-management/tenant-management.module#TenantManagementModule' },  
      //{ path: 'tenant-management/tenant-detail', canActivateChild: [AuthGuardService], loadChildren: './modules/tenant-detail/tenant-detail.module#TenantDetailModule' }, 
      // { path: 'tenant-detail/create-tenant-user', canActivateChild: [AuthGuardService], loadChildren: './modules/tenant-detail/tenant-detail.module#TenantDetailModule' },
      { path: 'dashboards-management', canActivateChild: [AuthGuardService], loadChildren: './modules/dashboards-management/dashboards-management.module#DashboardsManagementModule' },
      { path: 'setup-sensor-placement', canActivateChild: [AuthGuardService], loadChildren: './modules/setup-sensor-placement/setup-sensor-placement.module#SetupSensorPlacementModule' },
    ]
  },
  {
    path: ':id/login',
    loadChildren: './modules/login/login.module#LoginModule'
  },
  { path: 'reset-password', loadChildren: './modules/reset-password/reset-passsword.module#ResetPassswordModule' },
  { path: 'update-password', loadChildren: './modules/update-password/update-passsword.module#UpdatePassswordModule' }, 
  { path: 'reset/finish', loadChildren: './modules/user-requests-password/user-requests-password.module#UserRequestsPasswordModule' },
  { path: '**', redirectTo: '/system/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
