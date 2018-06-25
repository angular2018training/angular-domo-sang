import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientManagementPage } from './pages/client-management/client-management.page';
import { ClientDetailPage } from './pages/client-detail/client-detail.page';
import { ClientCreatePage } from './pages/client-create/client-create.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';

const ROUTES: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService], children: [
      { path: '', canActivateChild: [AuthGuardService], component: ClientManagementPage },
      { path: 'client-create', canActivateChild: [AuthGuardService], component: ClientCreatePage },
      { path: 'client-detail', canActivateChild: [AuthGuardService], component: ClientDetailPage },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})

export class ClientManagementRoutingModule { }
