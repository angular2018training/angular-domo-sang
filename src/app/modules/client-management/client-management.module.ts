import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ClientManagementRoutingModule } from './client-management.routing';
import { ClientService } from './client-management.service';
import { ClientManagementPage } from './pages/client-management/client-management.page';
import { ClientDetailPage } from './pages/client-detail/client-detail.page';
import { EditClientAdministrationDialog } from './components/edit-client-administration-dialog/edit-client-administration.dialog';
import { ClientCreatePage } from './pages/client-create/client-create.page';
import { BuildingManagementModule } from '../building-management/building-management.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ClientManagementPage,
    ClientDetailPage,
    EditClientAdministrationDialog,
    ClientCreatePage
  ],
  imports: [
    SharedModule,
    ClientManagementRoutingModule,
    BuildingManagementModule,
    NgSelectModule
  ],
  providers: [
    ClientService
  ],
  entryComponents: [
    EditClientAdministrationDialog
  ],
})
export class ClientManagementModule { }