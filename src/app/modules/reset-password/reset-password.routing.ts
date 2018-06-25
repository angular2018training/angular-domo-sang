import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordPage } from './pages/reset-password.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';



const LOGIN_ROUTES: Routes = [
  {
    path: '', component: ResetPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(LOGIN_ROUTES)],
  exports: [RouterModule]
})
export class ResetPasswordRoutingModule {}