import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantManagementRoutingModule } from './tenant-management.routing';
import { SharedModule } from '../../shared/shared.module';
import { TenantManagementService } from './tenant-management.service';
import { TenantManagementPage } from './pages/tenant-management/tenant-management.page';
import { TenantAddPage } from './pages/tenant-add/tenant-add.page';
import { UserTenantPage } from './pages/user-tenant/user-tenant.page';
import { TenantDetailPage } from './pages/tenant-detail/tenant-detail.page';
import { TenantUserDialog } from './component/tenant-user-dialog/tenant-user.dialog';
import { TenantUserCreateDialog } from './component/tenant-user-create-dialog/tenant-user-create.dialog';
import { UserTenantCreatePage } from './pages/user-tenant-create/user-tenant-create.page';

@NgModule({
  declarations: [
    TenantManagementPage,
    TenantAddPage,
    UserTenantPage,
    TenantDetailPage,
    TenantUserDialog,
    TenantUserCreateDialog,
    UserTenantCreatePage
  ],
  entryComponents: [
    TenantUserDialog,
    TenantUserCreateDialog
  ],
  imports: [
    SharedModule,
    TenantManagementRoutingModule,
  ],
  providers: [
    TenantManagementService
  ]
})
export class TenantManagementModule { }
