import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientConfigurationPage } from './pages/client-configuration/client-configuration.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';

const ROUTES: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService], children: [
      { path: '', canActivateChild: [AuthGuardService], component: ClientConfigurationPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})

export class ClientConfigurationRoutingModule { }
