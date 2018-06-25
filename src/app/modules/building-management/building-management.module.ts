import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { BuildingManagementService } from './building-management.service';
import { BuildingManagementRoutingModule } from './building-management.routing';
import { BuildingManagementPage } from './pages/building-management/building-management.page';
import { BuildingsPage} from './pages/buildings/buildings.page';
import { BuildingCreatePage } from './pages/building-create/building-create.page';
import { BuildingEditPage } from './pages/building-edit/building-edit.page';
import { PublishConfirmDialogComponent } from './components/publish-confirm-dialog/publish-confirm-dialog.component';
import { FloorDetailsPage } from './pages/floor-details/floor-details.page';
import { BuildingDetailsPage } from './pages/building-details/building-details.page';
import { FloorInformationComponent } from './components/floor-information/floor-information.component';
import { LocationsComponent } from './components/locations/locations.component';
import { SensorListComponent } from './components/sensor-list/sensor-list.component';
import { MeetingSpacesComponent } from './components/meeting-spaces/meeting-spaces.component';
import { ConnectionsComponent } from './components/connections/connections.component';
import { FloorEditDialogComponent } from './components/floor-edit-dialog/floor-edit-dialog.component';
import { FloorLayoutComponent } from './components/floor-layout/floor-layout.component';
import { OtherDataPage} from './pages/other-data/other-data.page';
import { WorkforceDataComponent } from './components/workforce-data/workforce-data.component';
import { MeetingRoomComponent } from './components/meeting-room/meeting-room.component';
import { MappingDataComponent } from './components/mapping-data/mapping-data.component';

@NgModule({
  imports: [
    SharedModule,
    BuildingManagementRoutingModule,
  ],
  declarations: [
    BuildingManagementPage,
    BuildingsPage,
    BuildingCreatePage,
    BuildingEditPage,
    PublishConfirmDialogComponent,
    FloorDetailsPage,
    BuildingDetailsPage,
    OtherDataPage,
    WorkforceDataComponent,
    MeetingRoomComponent,
    MappingDataComponent,
    FloorInformationComponent,
    LocationsComponent,
    SensorListComponent,
    MeetingSpacesComponent,
    ConnectionsComponent,
    FloorEditDialogComponent,
    FloorLayoutComponent,
  ],
  providers: [
    BuildingManagementService
  ],
  entryComponents: [
    PublishConfirmDialogComponent,
    FloorEditDialogComponent
  ],
})
export class BuildingManagementModule { }
