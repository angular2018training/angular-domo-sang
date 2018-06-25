import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { SYSTEM } from '../../../core/constants/system.constant';
import { UtilitiesService } from '../../../core/services/utilities.service';

@Component({
    templateUrl: './update-password.page.html',
    styleUrls: ['./update-password.page.scss']
})
export class UpdatePasswordPage implements OnInit {
    updateModel = {
        temporaryPassword: null,
        newPassword: null,
        confirmPassword: null,
    }
    constructor(private _AuthService: AuthService, private router: Router, private cookieService: CookieService, private _Utilities: UtilitiesService) {
    }


    ngOnInit() {

    }

    onFormSubmit() {

    }
}
