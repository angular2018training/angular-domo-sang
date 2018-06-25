import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardsManagementPage } from "./pages/dashboards-management/dashboards-management.page";
import { DashboardCreatePage } from './pages/dashboard-create/dashboard-create.page';
import { DashboardEditPage } from './pages/dashboard-edit/dashboard-edit.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';

const routes: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService],
    children: [
      { path: '', canActivateChild: [AuthGuardService], component: DashboardsManagementPage },      
      { path: 'create', canActivateChild: [AuthGuardService], component: DashboardCreatePage },
      { path: 'edit', canActivateChild: [AuthGuardService], component: DashboardEditPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsManagementRoutingModule { }
