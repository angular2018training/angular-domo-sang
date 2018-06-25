import { LOCAL_MESSAGE } from './../../../core/constants/message';
import { ValidationService } from './../../../core/services/validation.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService, User, Token, Role, TempRole, ACCOUNT_STATUS, LoginAccount } from '../../../core/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { SYSTEM, ROLE } from '../../../core/constants/system.constant';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { LoginService } from '../login.service';
import { PAGE_URL } from '../../../core/constants/navigation.constant';
import { API_CONFIGURATION } from "../../../core/constants/server.constant";
import { RecaptchaComponent } from 'ng-recaptcha';
import * as moment from 'moment';

@Component({
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit, OnDestroy {

	@ViewChild(RecaptchaComponent) captcha: RecaptchaComponent;

	inputMaxName = 100;

	emailPattern;

	errorMessage = '';
	userModel = {
		email: '',
		password:'',
		rememberMe: false,
		loginFailedNumber: 0,
		tenantId: null
	}
	constructor(private _UserService: UserService, private _AuthService: AuthService, private router: Router,
		private cookieService: CookieService, private _Utilities: UtilitiesService,
		private _LoginService: LoginService, private route: ActivatedRoute,
		private validationService: ValidationService) {

			this.emailPattern = validationService.emailFormat;

		let user: any = this._AuthService.getLoggedInUser();

		if (user) {
			// Handle privilege based on user Type
			if (user.useType === SYSTEM.ROLES.ADMIN) {
				this.router.navigate(['/client-management']);
			} else {
				this.router.navigate(['/projects-management']);
			}
		} else {
			this._AuthService.logoutUser();
		}

		// this._AuthService.logoutUser();
		this.subscribeId = this.route.params.subscribe(params => {
			this.tenantId = params['id'];
			this.checkTenant();
		});		


	}
	languages = [{ name: 'English', value: 'English', image: 'assets/en.png' }, { name: 'Japanese', value: 'Japanese', image: 'assets/japan.png' }];
	language = this.languages[0];
	showCredentialMsg: boolean;
	loginForm = new FormGroup({
		email: new FormControl(this.userModel.email, [
			Validators.maxLength(100),
			Validators.required,
			// Validators.email,
			Validators.pattern(this.emailPattern)
		]),
		password: new FormControl(this.userModel.password, [
			// Validators.minLength(0),
			Validators.required
		]),
		rememberMe: new FormControl()
	});
	get email() { return this.loginForm.get('email'); }
	get password() { return this.loginForm.get('password'); }
	subscribeId;
	tenantId;
	errorMessageId = '';
	tenant;

	captchaValue;

	ngOnInit() {
		let userInfo = this.getLoggedUserInfo();

		if (userInfo && userInfo.rememberMe) {
			this.loginForm.setValue({
				email: userInfo.email,
				password: userInfo.password,
				rememberMe: userInfo.rememberMe
			});
		}

		if (userInfo) {
			this.userModel.loginFailedNumber = userInfo.loginFailedNumber;
		}

		if (userInfo && userInfo.rememberMe) {
			this.userModel.email = userInfo.email;
			this.userModel.password = userInfo.password;
			this.userModel.rememberMe = userInfo.rememberMe;
		}
	}

	ngOnDestroy() {
		this.subscribeId.unsubscribe();
	}

	onFormSubmit() {
		if (!this.loginForm.valid) {
			this.errorMessageId = 'messages.error.bad.credentials';
			this.showCredentialMsg = true;
			return;
		}
		// let email = this.loginForm.get('email').value;
		// let password = this.loginForm.get('password').value;
		// let rememberMe = this.loginForm.get('rememberMe').value;
		this.showCredentialMsg = false;

		let userInfo = this.getLoggedUserInfo();

		let body = {
			username: this.userModel.email,
			password: this.userModel.password,
			reCaptcha: this.captchaValue
		}

		if (!this.captchaValue || (userInfo && userInfo.username === this.userModel.email && userInfo.loginFailedNumber <= 3)) {
			delete body.reCaptcha;
		}

		//password = this._Utilities.md5Text(password);
		this._LoginService.loginSystem(body).then((res) => {
			if (res) {
				if (!res.error && res.type !== 'error') {
					// Call API to get user info
					this._UserService.setToken(new Token(res.id_token));
					this.userModel.loginFailedNumber = 0;

					// Save user info to sesion storage
					this._UserService.setLoginInfo(this.userModel);

					this._LoginService.getUserInfo().then((userInfo) => {
						this._UserService.setTenantId(userInfo.tenantId);
						let user = new User(userInfo["id"], userInfo["email"], userInfo["firstName"], userInfo["lastName"],
							userInfo["fullName"], userInfo["phone"], userInfo["userType"], userInfo["accountStatus"],
							moment.unix(res.jwt_body.exp).format("MM/DD/YYYY hh:mm:ss"), res['password_reminder']);

						
						this._AuthService.setLoggedInUser(user);
						// Handle privilege based on user Type
						if (user.useType === SYSTEM.ROLES.ADMIN) {
							this.router.navigate(['/client-management']);
						} else {
							this.router.navigate(['/projects-management']);
						}
					}, error => {
						if (error) {
							console.log(error);
						}
					});
				} else {
					this.errorMessageId = 'messages.' + res.error_description;
					this.showCredentialMsg = true;
				}
			}
		}, error => {
			if (this.captcha) {
				this.captcha.reset();
			}
			this.captchaValue = null;
			
			this.userModel.loginFailedNumber = error.login_failed;

			// Save user info to sesion storage
			this._UserService.setLoginInfo(this.userModel);

			if (error && error.fieldErrors && error.fieldErrors.length > 0) {
				this.errorMessage = LOCAL_MESSAGE[error.fieldErrors[0].code];
			}
		});
	}

	goToResetPassword() {
		this.router.navigate(['/reset-password']);
	}
	recaptchaCallback(response) {
        this.captchaValue = response;
	};

	checkTenant() {
		if (this.tenantId !== 'system') {
			this._LoginService.checkTenant({ TenantId: this.tenantId }).then(res => {
				if (res && res.data) {
					let tenant = res.data;
					if (tenant.authenticateViaIDP) {
						// save tenantId
						// this._Utilities.setSessionStorage(SYSTEM.TENANT_ID, this.tenantId);
						this._Utilities.setLocalStorage(SYSTEM.TENANT_ID, this.tenantId);

						let redirectUrl = API_CONFIGURATION.URLS.ADMIN.SAML_LOGIN + '?entityId=' + tenant.entityId;
						window.location.replace(redirectUrl);
					} else {
						this.tenant = tenant;
					}
				} else { // tenant not existent
					this.router.navigate([this._AuthService.getLoginUrl()]);
				}
			});
		}
	}

	getLoggedUserInfo() {
		let userInfo = this._UserService.getLoginInfo();
		// if (userInfo && userInfo.username === this.userModel.email && userInfo.loginFailedNumber) {
		// 	this.userModel.loginFailedNumber = userInfo.loginFailedNumber;
		// } else {
		// 	this.userModel.loginFailedNumber = 0;
		// }
		return userInfo;
	}

	changeRememberMe() {
		this._UserService.setLoginInfo(this.userModel);
	}

	changeEmail() {
		this.getLoggedUserInfo();
	}
}
