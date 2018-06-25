import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LoginRoutingModule } from './login.routing';

import { LoginPage } from './pages/login.page';
import { LoginService } from './login.service';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    SharedModule,
    LoginRoutingModule,
  ],
  providers: [
    LoginService
  ]
})
export class LoginModule { }