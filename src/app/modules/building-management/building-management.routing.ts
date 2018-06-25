import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuildingManagementPage } from './pages/building-management/building-management.page';
import { BuildingsPage } from './pages/buildings/buildings.page';
import { BuildingCreatePage } from './pages/building-create/building-create.page';
import { BuildingEditPage } from './pages/building-edit/building-edit.page';
import { OtherDataPage } from './pages/other-data/other-data.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';


const routes: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService], component: BuildingManagementPage,
    children: [
      { path: 'other-data', canActivateChild: [AuthGuardService], component: OtherDataPage },
      { path: 'buildings', canActivateChild: [AuthGuardService], component: BuildingsPage },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingManagementRoutingModule { }
