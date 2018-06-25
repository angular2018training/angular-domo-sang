import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserDetailRoutingModule } from './user-detail.routing';
import { UserDetailService } from './user-detail.service';
import { UserDetailPage } from './pages/user-detail.page';


@NgModule({
  declarations: [
    UserDetailPage
  ],
  imports: [
    SharedModule,
    UserDetailRoutingModule,
  ],
  providers: [
    UserDetailService
  ]
})
export class UserDetailModule { }