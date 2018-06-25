import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { UpdatePasswordPage } from './pages/update-password.page';
import { UpdatePasswordService } from './update-password.service';
import { UpdatePasswordRoutingModule } from './update-password.routing';
@NgModule({
  imports: [
    SharedModule,
    UpdatePasswordRoutingModule
  ],
  declarations: [UpdatePasswordPage],
  providers: [
    UpdatePasswordService
  ] 
})
export class UpdatePassswordModule { }
 