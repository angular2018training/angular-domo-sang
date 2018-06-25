import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementPage } from './pages/user-management/user-management.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';

const ROUTES: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService], children: [
      { path: '', canActivateChild: [AuthGuardService], component: UserManagementPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})

export class UserManagementRoutingModule { }
