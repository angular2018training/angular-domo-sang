import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { TenantManagementService } from '../../tenant-management.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Component, OnInit, ViewChild, ElementRef, Inject,Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../../core/components/breadcrumb/breadcrumb.module';
import * as NAV_CONSTANT from '../../../../core/constants/navigation.constant';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { SYSTEM, PATTERNS } from '../../../../core/constants/system.constant';
import { TenantUserCreateDialog } from '../../component/tenant-user-create-dialog/tenant-user-create.dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: "app-tenant-add",
  templateUrl: "./tenant-add.page.html",
  styleUrls: ["./tenant-add.page.scss"]
})
export class TenantAddPage implements OnInit {
  @ViewChild("search") searchEle: ElementRef;

  country: any;
  province: any;
  inputMaxName = 100;
  inputMaxPhone = 16;
  numberPattern = "^[0-9]{0,}$";
  pattern = PATTERNS.VALIDATE_EMAIL;
  patternInput = PATTERNS.VALIDATE_LEADING_SPACE;
  tenantModel = {
    name: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    country: '',
    province: '',
    tenantId: ""
  };

  checkStep1Done = false;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private router: Router,
    private _AuthService: AuthService,
    private activatedRoute: ActivatedRoute,
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
    private _TenantManagementService: TenantManagementService,
    private _BreadcrumbService: BreadcrumbService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: [
        "",
        Validators.required,
        Validators.maxLength(100),
        Validators.email
      ]
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });

    this.getCountry();
  }

  tenantForm = new FormGroup({
    email: new FormControl(this.tenantModel.email, [
      Validators.required,
      Validators.maxLength(100),
      Validators.email
    ]),

    name: new FormControl(this.tenantModel.name, [
      Validators.required,
      Validators.maxLength(100)
    ]),
    phone: new FormControl(this.tenantModel.phone),
    address: new FormControl(this.tenantModel.address),
    postalCode: new FormControl(this.tenantModel.postalCode),
    country: new FormControl(this.tenantModel.country),
    province: new FormControl(this.tenantModel.country)
  });
  get name() {
    return this.tenantForm.get("name");
  }
  get phone() {
    return this.tenantForm.get("phone");
  }
  get email() {
    return this.tenantForm.get("email");
  }
  get address() {
    return this.tenantForm.get("address");
  }
  get postalCode() {
    return this.tenantForm.get("postalCode");
  }

  getCountry() {
    return this._TenantManagementService.getCountryTenant().then(
      result => {
        if (result && result.length > 0) {
          this.country = result;
          if (this.country && this.country.length > 0) {
            this.tenantModel.country = this.country[0].countryId;
            this.getProvinceByIdCountry(this.tenantModel.country);
          }
        }
      }
    );
  }

  getProvinceByIdCountry(countryId) {
    let index = _.findIndex(this.country, (e: any) => {
      return e.countryId === parseInt(countryId);
    });
    if (index > -1) {
      this.province = this.country[index].provinceDTO;
      if (this.province && this.province.length > 0) {
        this.tenantModel.province = this.province[0].provinceId;
      }
      
    }
  }
}
