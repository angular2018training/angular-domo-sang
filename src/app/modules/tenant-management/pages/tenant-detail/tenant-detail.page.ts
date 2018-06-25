import { UtilitiesService } from "../../../../core/services/utilities.service";
import {
  ITdDataTableColumn,
  TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent,
  TdDataTableService,
  IPageChangeEvent
} from "@covalent/core";
import * as _ from "lodash";
import { Observable } from "rxjs/Observable";
import { TenantManagementService } from "../../tenant-management.service";
import { AuthService } from "../../../../core/services/auth.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  Input
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { BreadcrumbService } from "../../../../core/components/breadcrumb/breadcrumb.module";
import * as NAV_CONSTANT from "../../../../core/constants/navigation.constant";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TenantUserDialog } from "../../component/tenant-user-dialog/tenant-user.dialog";
import { CookieService } from "ngx-cookie-service";
import { TenantUserCreateDialog } from "../../component/tenant-user-create-dialog/tenant-user-create.dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SYSTEM, PATTERNS } from "../../../../core/constants/system.constant";
@Component({
  selector: "app-tenant-detail",
  templateUrl: "./tenant-detail.page.html",
  styleUrls: ["./tenant-detail.page.scss"]
})
export class TenantDetailPage implements OnInit {
  patternInput = PATTERNS.VALIDATE_LEADING_SPACE;
  country: any;
  province: any;
  inputMaxName = 100;
  inputMaxPhone = 16;
  numberPattern = "^[0-9]{0,}$";
  tenantModel = {
    tenantId: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    country: "",
    province: "",
    status: null
  };
  id = Number(this.activatedRoute.snapshot.queryParams["id"]);
  tenantSrc;
  valueChange = false;

  @ViewChild("search") searchEle: ElementRef;
  constructor(
    private router: Router,
    private _AuthService: AuthService,
    private activatedRoute: ActivatedRoute,
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
    private _TenantManagementService: TenantManagementService,
    private _BreadcrumbService: BreadcrumbService,
    public dialog: MatDialog
  ) {}

  @ViewChild("tenantDetailForm") tenantDetailForm;

  ngOnInit() {
    this.getTenantDetail();
    // this.getCountry();
  }

  ngAfterViewInit() {
    this.tenantDetailForm.valueChanges.subscribe(values =>
      this.changeFormValue()
    );
  }

  compareData(obj1, obj2) {
    if (obj1 && obj2) {
      for (let key in obj1) {
        if (obj2[key] === undefined || obj1[key] !== obj2[key]) {
          return false;
        }
      }
    }
    return true;
  }

  private changeFormValue(): void {
    // compare source data and updated data.
    this.valueChange = this.compareData(this.tenantModel, this.tenantSrc);
  }

  getTenantDetail() {
    return this._TenantManagementService.getTenantById(this.id).then(
      result => {
        if (result.status == 1){
          if (result) {
            let temp = result;
            this.tenantModel = {
              tenantId: temp.id,
              name: temp.name,
              email: temp.email,
              phone: temp.phone,
              address: temp.address,
              postalCode: temp.postalCode,
              country: temp.countryId,
              province: temp.provinceId,
              status: 1
            };

            this.tenantSrc = _.cloneDeep(this.tenantModel);

            this.getCountry();
          }
        }
        else {
         this._UtilitiesService.showConfirmDeletedDialog("Failed to delete, because it was deleted by another user", (res) => {
            this.router.navigate(["/tenant-management"]);
        })
      }  
      });
  }

  tenantForm = new FormGroup({
    email: new FormControl(this.tenantModel.email),
    tenantId: new FormControl(this.tenantModel.tenantId),
    name: new FormControl(this.tenantModel.name),
    phone: new FormControl(this.tenantModel.phone),
    address: new FormControl(this.tenantModel.address),
    postalCode: new FormControl(this.tenantModel.postalCode),
    country: new FormControl(this.tenantModel.country),
    province: new FormControl(this.tenantModel.province)
  });
  get name() {
    return this.tenantForm.get("name");
  }

  updateTenantDetail() {
    let errorInput = [];
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      let request = {
        name: this.tenantModel.name,
        email: this.tenantModel.email,
        phone: this.tenantModel.phone,
        countryId: parseInt(this.tenantModel.country),
        address: this.tenantModel.address,
        postalCode: this.tenantModel.postalCode,
        id: this.tenantModel.tenantId,
        provinceId: parseInt(this.tenantModel.province),
        status: 1
      };
      return this._TenantManagementService.updateTenant(request).then(
        result => {
          if (result) {
            this._UtilitiesService.showSuccessMessageAPI(result);
            this.tenantModel.tenantId = result.id;
          }
        }
      );
    }
  }

  getCountry() {
    return this._TenantManagementService.getCountryTenant().then(
      result => {
        if (result && result.length > 0) {
          this.country = result;

          if (this.country) {
            let countryIndex = this.country.findIndex(e => { return e.countryId === this.tenantModel.country});
            this.province = countryIndex > -1 ? this.country[countryIndex].provinceDTO : [];
          }
        } else {
          this.country = [];
          this.province = [];
        }
      }
    );
  }

  getProvinceByIdCountry() {
    let i = _.findIndex(this.country, (e: any) => {
      return e.countryId === parseInt(this.tenantModel.country);
    });
    
    if (i > -1) {
      this.province = this.country[i].provinceDTO;
    } else {
      this.province = [];
    }
  }
}
