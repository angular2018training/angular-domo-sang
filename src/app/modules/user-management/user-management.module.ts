import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserManagementRoutingModule } from './user-management.routing';
import { UserManagementService } from './user-management.service';
import { UserManagementPage } from './pages/user-management/user-management.page';
import { GroupAuthorityDialog } from './components/group-authority-dialog/group-authority.dialog';


@NgModule({
  declarations: [
    UserManagementPage,

    GroupAuthorityDialog
  ],
  imports: [
    SharedModule,
    UserManagementRoutingModule,
  ],
  providers: [
    UserManagementService
  ],
  entryComponents: [
    GroupAuthorityDialog
  ],
})
export class UserManagementModule { }