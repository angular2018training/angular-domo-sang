import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdatePasswordPage } from './pages/update-password.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';



const LOGIN_ROUTES: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService], component: UpdatePasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(LOGIN_ROUTES)],
  exports: [RouterModule]
})
export class UpdatePasswordRoutingModule {}