import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PAGE_URL } from '../../constants/navigation.constant';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent implements OnInit {
  user;
  constructor(private router: Router, private authService: AuthService, private _UtilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
  }

  signout() {
    this._UtilitiesService.showConfirmDialog('tags.message.confirm.quit', (res) => {
      if (res) {
         this.authService.logoutUser();
         this.router.navigate([this.authService.getLoginUrl()]);
      }
    })
  }

  goToDetail() {
    this.router.navigate([PAGE_URL.COMMON.USER_DETAIL]);
  }
}
