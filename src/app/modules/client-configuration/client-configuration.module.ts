import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ClientConfigurationRoutingModule } from './client-configuration.routing';
import { ClientConfigurationService } from './client-configuration.service';
import { ClientConfigurationPage } from './pages/client-configuration/client-configuration.page';

@NgModule({
  declarations: [
    ClientConfigurationPage,
  ],
  imports: [
    SharedModule,
    ClientConfigurationRoutingModule,
  ],
  providers: [
    ClientConfigurationService
  ]
})
export class ClientConfigurationModule { }