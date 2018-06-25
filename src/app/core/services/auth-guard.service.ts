import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { PAGE_URL } from '../constants/navigation.constant';
import * as _ from 'lodash';
import { UtilitiesService } from './utilities.service';
import { SYSTEM } from '../constants/system.constant';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router, private _Utilities: UtilitiesService) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // let url: string = state.url;

    return this.authService.checkValidSession();

    // if (this.authService.isUserLoggedIn()) {
    //   return true;
    // }
    // this.authService.setRedirectUrl(url);
    // return true;
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let loggedInUser = this.authService.getLoggedInUser();
    let urls = [];
    // switch (loggedInUser.role) {
    //   // case 'ADMIN_CLIENT':
    //   //   urls = _.values(PAGE_URL.ADMIN_CLIENT);
    //   //   break;
    //   // case 'USER':
    //   //   urls = _.values(PAGE_URL.USER);
    //   //   break;
    //   case 'admin':
    //     urls = _.values(PAGE_URL.ADMIN_SYSTEM);
    //     break;
    // };
    urls = _.values(PAGE_URL.ADMIN_SYSTEM);
    urls = _.concat(urls, _.values(PAGE_URL.COMMON));
    let url = _.some(urls, (url) => {
      return state.url.indexOf(url) !== -1;
    });
    if (!url) { // redirect to default page
      this.authService.setRedirectUrl(urls[0]);
      this.router.navigate([urls[0]]);
      return false;
    }
    return true;
  }
}