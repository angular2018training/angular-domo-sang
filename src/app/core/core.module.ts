import { ValidationService } from './services/validation.service';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MomentModule } from 'angular2-moment';
import { ToastrModule } from 'ngx-toastr';
import * as _ from 'lodash';

// Services
import { UtilitiesService } from './services/utilities.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
// Components
import { MainPageComponent } from './components/main-page/main-page.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HeadingComponent } from './components/heading/heading.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { BreadcrumbModule } from './components/breadcrumb/breadcrumb.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog.dialog';
import { UserService } from './services/user.service';
import { ConfirmDialogDeletedDialog} from './components/confirm-dialog-deleted/confirm-dialog-deleted.dialog';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/languages/', '.json');
}
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      maxOpened: 5,
    }),
    BreadcrumbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    MainPageComponent,
    NavigationComponent,
    HeadingComponent,
    FooterComponent,
    MenuItemComponent,

    ConfirmDialog,

    ConfirmDialogDeletedDialog
  ],
  exports: [
    BreadcrumbModule,
    MainPageComponent,
    NavigationComponent,
    HeadingComponent,
    FooterComponent,
    MenuItemComponent,

    ConfirmDialog,
    ConfirmDialogDeletedDialog
  ],
  providers: [
    UtilitiesService,
    AuthService,
    CookieService,
    AuthGuardService,
    UserService,
    ValidationService
  ],
  entryComponents: [ConfirmDialog, ConfirmDialogDeletedDialog]
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
