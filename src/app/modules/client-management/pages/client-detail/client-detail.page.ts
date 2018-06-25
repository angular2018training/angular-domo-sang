import { UserService } from './../../../../core/services/user.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { ClientService } from '../../client-management.service';
import { Observable } from 'rxjs/Observable';
import { BreadcrumbService } from '../../../../core/components/breadcrumb/breadcrumb.module';
import * as NAV_CONSTANT from '../../../../core/constants/navigation.constant';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { EditClientAdministrationDialog } from '../../components/edit-client-administration-dialog/edit-client-administration.dialog';
import { ValidationService } from './../../../../core/services/validation.service';
@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.page.html',
  styleUrls: ['./client-detail.page.scss']
})
export class ClientDetailPage implements OnInit {
  tenantError = false;
  tenant:any;
  country: any;
  province: any;
  industryId: any;
  enterprise: any;
  selectTenant: number;
  clientData;
  totalElements: any;
  clientId;
  clientSrc;
  //valueChange = false;
  inputMaxName = 100;
  inputMaxPhone = 16;
  inputMaxNote = 500;
  inputMaxAddress = 100;
  clientName = /^[_a-zA-Z0-9]+.*$/;
  numberPhone = "^[0-9]{0,}$";
  emailFormat = /^[_a-zA-Z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
  clientdetail = {
    id: '',
    name:'',
    tenantId: null,
    address:'',
    phone:'',
    email:'',
    enterpriseId:'',
    industryId:'',
    note:'',
    publishStatus:'',
    publishDate:'',
    createdDate:'',
    lastModifiedDate:'',
    countryId:'',
    provinceId:''
    };
  showInfo: boolean = true;
  @ViewChild('stepper') stepper;

  businessUnits = [];

  times = [
    { "value": "Hours" },
    { "value": "Minutes" }
  ];
  createClientForm = new FormGroup({
    name: new FormControl(this.clientdetail.name, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    email: new FormControl(this.clientdetail.email, [
      Validators.required,
    ]),
    phone: new FormControl(this.clientdetail.phone, [
      // Validators.required,
      Validators.maxLength(16),
    ]),
    tenantId: new FormControl(this.clientdetail.tenantId,[
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
    id: new FormControl,   
  });
  get name() { return this.createClientForm.get('name'); }
  get email() { return this.createClientForm.get('email'); }
  get phone() { return this.createClientForm.get('phone'); }
  get tenantId() { return this.createClientForm.get('tenantId'); }
  constructor(
    public dialog: MatDialog, 
    private activatedRoute: ActivatedRoute, 
    private _UtilitiesService: UtilitiesService, 
    private _dataTableService: TdDataTableService, 
    private _ClientService: ClientService, 
    private router: Router,
    private userService: UserService,
    private validationService: ValidationService,
  ) {
    this.clientId = this.activatedRoute.snapshot.queryParams['id'];

    this.userService.setTenantId(this.clientId);

    // set language
    this.changeLanguage();
    this._UtilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.changeLanguage();
    });
    this.emailFormat = validationService.emailFormat;
  }

  ngOnInit() {
    this.clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);

    this.getDetailClient(this.clientId);
    this.getCountry();
    this.getListTenant();
    this.getListEnterprise();
    this.getListIndustry();
    
    // handle search input
  }

  changeLanguage() {
    this._UtilitiesService.translateValue(this.listTitle, null).subscribe(value => {
      for (let i = 0; i < this.listTitle.length; i++) {
        this.columns[i].label = value[this.listTitle[i]];
      }
    });
  }

  listTitle = [
    'tags.clientDetail.u.userId',
    'tags.clientDetail.u.username',
    'tags.clientDetail.u.email',
    'tags.clientDetail.u.status',
    'tags.clientDetail.u.createdDate',
    // 'tags.action'
  ];

  columns: ITdDataTableColumn[] = [
    { name: 'id', label: '', filter: true, sortable: true },
    { name: 'name', label: '', filter: true, sortable: true },
    { name: 'email', label: '', filter: true, sortable: true },
    { name: 'status', label: '', filter: true, sortable: true },
    { name: 'createdDate', label: '', filter: true, sortable: true },
    // { name: 'action', label: 'Action', width: 100 }
  ];

  data: any[] = [];
  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [10, 20, 30, 40];
  pageSize: number = this.pageSizes[0];
  sortBy: string = 'id';
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

 
  onRowClick(row) {
  }
  onCancelClick(){
    this.router.navigate(['/client-management/buildings'], { queryParams: { clientId: this.clientId } })
  }
  onSaveClick(){
    this.saveClient();
  }
  saveClient() {
      this.clientData = this.prepareCreateData();
      if (this.clientdetail.publishStatus == '1') {
        this._UtilitiesService.showError('Cannot update details of Published Client');
        return;
      }
      return this._ClientService.updateClient(this.clientdetail).then(result => {
        if (result) {
            this._UtilitiesService.showSuccess('Update successfully');
        }
      });
    
    }
  getDetailClient(id){
    return this._ClientService.getClientById(id).then(result => {
      if (result) {
        this.clientdetail = result;
        this.clientSrc = _.cloneDeep(this.clientdetail);

        this.businessUnits = result.businessUnitName;
      }
    });
  }

  prepareCreateData() {
    let formData = new FormData();

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
      formData.append('enterpriseId', this.clientdetail.enterpriseId);
    }
    
    if (this.clientdetail.industryId) {
      formData.append('industryId', this.clientdetail.industryId);
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
      return e.countryId === parseInt(countryId);
    })
    if (index > -1) {
      this.province = this.country[index].provinceDTO;
    }

  }

  getListTenant() {
    this._ClientService.getTenantList().then(result => {
      if (result) {
        this.tenant = result.content;
        this.selectTenant = this.data.length > 0 ? this.data[0].id : null;
        this.totalElements = result.totalElements;
      }
      return this._ClientService.getTenantListSize(this.totalElements).then(result => {
        if (result) {
          this.tenant = result.content;
          this.selectTenant = this.data.length > 0 ? this.data[0].id : null;
        }        
      });
    });
  }
  
  getListIndustry(){
    return this._ClientService.getIndustryType().then(result => {
      if (result && result.length > 0) {
        this.industryId = result;
      } else {
        this.industryId = [];
      }
    }, err => {
     
    });

}

 changePartner() {
    this.tenantError = true;
    this.userService.setTenantId(this.clientdetail.tenantId);
  }

getListEnterprise(){
  return this._ClientService.getEnterprise().then(result => {
    if (result && result.length > 0) {
      this.enterprise = result;
    } else {
      this.enterprise = [];
    }
  }, err => {

  });
  }
}




