import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantManagementPage } from './pages/tenant-management/tenant-management.page';
import { TenantAddPage } from './pages/tenant-add/tenant-add.page';
import { TenantDetailPage } from './pages/tenant-detail/tenant-detail.page';
import { TenantUserDialog } from './component/tenant-user-dialog/tenant-user.dialog';
import { TenantUserCreateDialog } from './component/tenant-user-create-dialog/tenant-user-create.dialog';
import { AuthGuardService } from '../../core/services/auth-guard.service';

const ROUTES: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService], children: [
      { path: '', canActivateChild: [AuthGuardService], component: TenantManagementPage },
      { path: 'add', canActivateChild: [AuthGuardService], component: TenantAddPage },
      {path: 'tenant-detail', canActivateChild: [AuthGuardService], component:TenantDetailPage}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class TenantManagementRoutingModule { }
