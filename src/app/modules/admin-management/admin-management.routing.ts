import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagementPage } from './pages/admin-management/admin-management.page';
import { AdminAddPage } from './pages/admin-add/admin-add.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';

const ROUTES: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService], children: [
      { path: '', canActivateChild: [AuthGuardService], component: AdminManagementPage },
      { path: 'add', canActivateChild: [AuthGuardService], component: AdminAddPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})

export class AdminManagementRoutingModule { }
