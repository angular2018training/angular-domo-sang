import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminManagementRoutingModule } from './admin-management.routing';
import { AdminService } from './admin-management.service';
import { AdminManagementPage } from './pages/admin-management/admin-management.page';
import { EditAdminManagementDialog } from './components/edit-admin-management-dialog/edit-admin-management.dialog';
import { AdminAddPage } from './pages/admin-add/admin-add.page';


@NgModule({
  declarations: [
    AdminManagementPage,
    EditAdminManagementDialog,
    AdminAddPage,
  ],
  imports: [
    SharedModule,
    AdminManagementRoutingModule,
  ],
  providers: [
    AdminService
  ],
  entryComponents: [
    EditAdminManagementDialog
  ],
})
export class AdminManagementModule { }