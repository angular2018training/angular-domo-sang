import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ResetPasswordPage } from './pages/reset-password.page';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordRoutingModule } from './reset-password.routing';

@NgModule({
  imports: [
    SharedModule,
    ResetPasswordRoutingModule
  ],
  declarations: [ResetPasswordPage],
  providers: [
    ResetPasswordService
  ]
})
export class ResetPassswordModule { }
