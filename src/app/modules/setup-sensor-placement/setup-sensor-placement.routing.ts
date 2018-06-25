import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupSensorPlacementPage } from './pages/setup-sensor-placement/setup-sensor-placement.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';

const routes: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService], component: SetupSensorPlacementPage,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupSensorPlacementRoutingModule { }
