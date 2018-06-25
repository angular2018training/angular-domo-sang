import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SetupSensorPlacementRoutingModule } from './setup-sensor-placement.routing';
import { SetupSensorPlacementPage } from './pages/setup-sensor-placement/setup-sensor-placement.page';
import { SetupSensorPlacementService } from './setup-sensor-placement.service';
import { InformationDialogComponent } from './components/information-dialog/information-dialog.component';
import { ChangeSensorDialogComponent } from './components/change-sensor-dialog/change-sensor-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    SetupSensorPlacementRoutingModule,

  ],
  declarations: [SetupSensorPlacementPage, InformationDialogComponent, ChangeSensorDialogComponent],
  providers: [
    SetupSensorPlacementService
  ],
  entryComponents: [
    InformationDialogComponent,
    ChangeSensorDialogComponent
  ],
})
export class SetupSensorPlacementModule { }
