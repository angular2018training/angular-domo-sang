import { NgModule,ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRequestsPasswordPage } from './pages/user-requests-password.page';
import { AuthGuardService } from '../../core/services/auth-guard.service';


const ROUTES: Routes = [
  {
    path: '', children: [
      { path: '', component: UserRequestsPasswordPage },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class UserRequestsPasswordRoutingModule { }
