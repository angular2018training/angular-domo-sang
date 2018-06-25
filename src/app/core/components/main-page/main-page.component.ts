import { Router } from '@angular/router';
import { UtilitiesService } from './../../services/utilities.service';
import { AuthService } from './../../services/auth.service';


import { Component, OnInit } from '@angular/core';
import { LOCAL_MESSAGE } from '../../constants/message';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  passwordReminder;

  constructor(private authService: AuthService,
    private utilitiesService: UtilitiesService,
    private router: Router) {

  }

  ngOnInit() {
    let loggedInUser = this.authService.getLoggedInUser();

    if (loggedInUser) {
      this.passwordReminder = loggedInUser.passwordReminder;

      if (Number(this.passwordReminder) === 0) {
        this.utilitiesService.translateValueByKey(LOCAL_MESSAGE['64']).subscribe(value => {
          this.utilitiesService.showError(value);
        })
        this.router.navigate(['user-detail']);

      }
    }
  }
}