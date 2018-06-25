import { ValidationService } from './../../../../core/services/validation.service';
import { UserService } from './../../../../core/services/user.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ClientService } from '../../client-management.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { EditClientAdministrationDialog } from '../../components/edit-client-administration-dialog/edit-client-administration.dialog';
import { query } from '@angular/core/src/animation/dsl';
import * as _ from 'lodash';
@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.page.html',
  styleUrls: ['./client-create.page.scss']
})
export class ClientCreatePage implements OnInit {
  tenantError = false;
  data: any[] = [];
  country: any;
  industryType: any;
  enterprise: any;
  tenant: any;
  selectTenant: number;
  totalElements: number;
  province:any;
  // clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
  clientId;
  clientData;
  inputMaxName = 100;
  inputMaxPhone = 16;
  inputMaxNote = 500;
  inputMaxAddress = 100;
  clientName = /^[_a-zA-Z0-9]+.*$/;
  numberPhone = "^[0-9]{0,}$";
  emailFormat;
  clientdetail = {
    tenantId: null,
    name: '',
    address: '',
    phone: '',
    email: '',
    enterpriseId: null,
    industryId: null,
    note: '',
    countryId: null,
    provinceId: null,
  };
  createClientForm = new FormGroup({
    name: new FormControl(this.clientdetail.name, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    email: new FormControl(this.clientdetail.email, [
      Validators.required,
      Validators.pattern(this.emailFormat)
    ]),
    phone: new FormControl(this.clientdetail.phone, [
      // Validators.required,
      Validators.maxLength(16),
    ]),
    tenantId: new FormControl(this.clientdetail.tenantId, [
      Validators.required,
    ]),
    note: new FormControl(this.clientdetail.note, [
      Validators.maxLength(500),
    ]),
    address: new FormControl(this.clientdetail.address, [
      Validators.maxLength(100),
    ]),
    enterpriseId: new FormControl,
    industryId: new FormControl,
    provinceId: new FormControl,
    countryId: new FormControl,

  });
  get name() { return this.createClientForm.get('name'); }
  get email() { return this.createClientForm.get('email'); }
  get phone() { return this.createClientForm.get('phone'); }
  get tenantId() { return this.createClientForm.get('tenantId'); }
  constructor(private dialog: MatDialog,
    private router: Router,
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
    private _ClientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private validationService: ValidationService) {
    // set language
    this.changeLanguage();
    this._UtilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.changeLanguage();
    });

    this.emailFormat = validationService.emailFormat;
  }

  ngOnInit() {
    this.getCountry();
    this.getListTenant();
    this.getListIndustry();
    this.getListEnterprise(); 
  }
  changeLanguage() {
    this._UtilitiesService.translateValue(this.listTitle, null).subscribe(value => {
      for (let i = 0; i < this.listTitle.length; i++) {
        this.columns[i].label = value[this.listTitle[i]];
      }
    });
  }
  listTitle = [
    'tags.clientManagement.id',
    'tags.clientManagement.clientName',
    'tags.clientManagement.address',
    'tags.clientManagement.province',
    'tags.clientManagement.country',
    'tags.clientManagement.phone',
    'tags.clientManagement.email',
    'tags.clientManagement.enterpriseType',
    'tags.clientManagement.industryType',
  ];

  columns: ITdDataTableColumn[] = [
    { name: 'id', label: '', filter: true, sortable: true },
    { name: 'clientName', label: '', filter: true, sortable: true },
    { name: 'address', label: '', filter: true, sortable: true },
    { name: 'provinceName', label: '', filter: true, sortable: true },
    { name: 'country', label: '', filter: true, sortable: true },
    { name: 'phone', label: '', filter: true, sortable: true },
    { name: 'email', label: '', filter: true, sortable: true },
    { name: 'enterpriseType', label: '', filter: true, sortable: true },
    { name: 'industryType', label: '', filter: true, sortable: true },
  ];
  clientCreate() { }
  selectEvent(files: FileList | File): void {
    if (files instanceof FileList) {
    } else {
    }
  }

  uploadEvent(files: FileList | File): void {
    if (files instanceof FileList) {
    } else {
    }
  }

  cancelEvent(): void {
  }
  onCancelClick() {
    this.router.navigate(['/client-management']);
  }

  onSaveClick() {
    let errorInput = [];
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.saveClient();
    }
  }
  saveClient() {
    this.clientData = this.prepareCreateData();
    return this._ClientService.createClient(this.clientdetail).then(result => {
      if (result) {
        this._UtilitiesService.showSuccess('Create successfully');
        this.clientId = result.id;
        this.router.navigate(['/client-management/buildings'], { queryParams: { clientId: this.clientId } });
      }

    });

  }
  change() {
    this.clientdetail.name = this.clientdetail.name.trim();
  }


inputNumber(e) {
  if (
    e.keyCode == 187 ||
    e.keyCode == 189 ||
    e.keyCode == 69 ||
    e.keyCode == 109 ||
    e.keyCode == 69 ||
    e.keyCode == 107
  ) {
    return false;
  }
  return true;
}

  prepareCreateData() {
    let formData = new FormData();
    console.log(this.clientdetail);

    formData.append('name', this.clientdetail.name);
    formData.append('address', this.clientdetail.address);
    formData.append('phone', this.clientdetail.phone);
    formData.append('note', this.clientdetail.note);
    if (this.clientdetail.tenantId) {
      formData.append('tenantId', this.clientdetail.tenantId);
    }
    if (this.clientdetail.countryId) {
      formData.append('countryId', this.clientdetail.countryId);
    }
    if (this.clientdetail.provinceId) {
      formData.append('provinceId', this.clientdetail.provinceId);
    }
    if (this.clientdetail.enterpriseId) {
      formData.append('enterpriseType', this.clientdetail.enterpriseId);
    }

    if (this.clientdetail.industryId) {
      formData.append('industryType', this.clientdetail.industryId);
    }
    return formData;

  }

  getCountry() {
    return this._ClientService.getCountry().then(result => {
      if (result && result.length > 0) {
        this.country = result;
        this.getProvinceByIdCountry(this.clientdetail.countryId);
      } else {
        this.country = [];
      }
    });
  }
  onChangeCountry(country) {
    if (country){
      this.getProvinceByIdCountry(country.countryId);
    }else{
      this.province = [];
    }
    this.clientdetail.provinceId = null;
  }

  getProvinceByIdCountry(countryId) {
    let index = _.findIndex(this.country, (e: any) => {
      return e.countryId == countryId;
    });console.log(this.country);
    if (index > -1) {
      this.province = this.country[index].provinceDTO;
    }

  }
  getListTenant() {
    return this._ClientService.getTenantList().then(result => {
      if (result) {
        this.tenant = result.content;
        this.selectTenant = this.data.length > 0 ? this.data[0].id : null;
        this.totalElements = result.totalElements;

        this._ClientService.getTenantListSize(this.totalElements).then(result => {
          if (result) {
            this.tenant = result.content;
            this.selectTenant = this.data.length > 0 ? this.data[0].id : null;
          }
        });
      }
    });
  }

  changePartner() {
    this.tenantError = true;
    this.userService.setTenantId(this.clientdetail.tenantId);
  }



  getListIndustry(){
    return this._ClientService.getIndustryType().then(result => {
      if (result && result.length > 0) {
        this.industryType = result;
      } else {
        this.industryType = [];
      }
    }, err => {
      // this.industryType = [
        // {
        //     "industryId": 1,
        //     "industryEngName": "Manufacturing",
        //     "industryJanName": "製�業"
        // },
        // {
        //     "industryId": 2,
        //     "industryEngName": "Retail, wholesale trade",
        //     "industryJanName": "卸売・小売業"
        // },
        // {
        //     "industryId": 3,
        //     "industryEngName": "Publishing and printing related",
        //     "industryJanName": "出版�印刷関連産業"
        // }]
    }
  );

}

getListEnterprise(){
  return this._ClientService.getEnterprise().then(result => {
    if (result && result.length > 0) {
      this.enterprise = result;
    } else {
      this.enterprise = [];
    }
  }, err => {
  //   this.enterprise =
  //   [
  //     {
  //         "enterpriseId": 1,
  //         "enterpriseEngName": "Enterprise 1",
  //         "enterpriseJanName": "企業タイ�1"
  //     },
  //     {
  //         "enterpriseId": 2,
  //         "enterpriseEngName": "Enterprise 2",
  //         "enterpriseJanName": "企業タイ�2"
  //     },
  //     {
  //         "enterpriseId": 3,
  //         "enterpriseEngName": "Enterprise 3",
  //         "enterpriseJanName": "企業タイ�3"
  //     }
  // ]
  });

}
}