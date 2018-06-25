import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SystemConfigurationRoutingModule } from './system-configuration.routing';
import { SystemConfigurationService } from './system-configuration.service';
import { SystemConfigurationPage } from './pages/system-configuration/system-configuration.page';
import { ShowlogDialogComponent } from './components/showlog-dialog/showlog-dialog.component';

@NgModule({
  declarations: [
    SystemConfigurationPage,
    ShowlogDialogComponent,
  ],
  imports: [
    SharedModule,
    SystemConfigurationRoutingModule,
  ],
  providers: [
    SystemConfigurationService
  ],
  entryComponents: [
    ShowlogDialogComponent,
  ],
})
export class SystemConfigurationModule { }