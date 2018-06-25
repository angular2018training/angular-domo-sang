import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { UserRequestsPasswordRoutingModule } from './user-requests-password.routing';
import { UserRequestsPasswordService} from './user-requests-password.service';
import { UserRequestsPasswordPage } from './pages/user-requests-password.page';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserRequestsPasswordRoutingModule
  ],
  providers: [
    UserRequestsPasswordService
  ],
  declarations: [
  UserRequestsPasswordPage]
})
export class UserRequestsPasswordModule { }
