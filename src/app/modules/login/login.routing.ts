import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPage } from './pages/login.page';

const LOGIN_ROUTES: Routes = [
  {
    path: '', component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(LOGIN_ROUTES)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}