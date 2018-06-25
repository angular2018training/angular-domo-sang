import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemConfigurationPage } from './pages/system-configuration/system-configuration.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';

const ROUTES: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService], children: [
      { path: '', canActivateChild: [AuthGuardService], component: SystemConfigurationPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})

export class SystemConfigurationRoutingModule { }
