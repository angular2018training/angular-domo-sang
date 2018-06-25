import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { ClientConfigurationService } from '../../client-configuration.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-client-configuration',
  templateUrl: './client-configuration.page.html',
  styleUrls: ['./client-configuration.page.scss']
})
export class ClientConfigurationPage implements OnInit {

  configurationForm = new FormGroup({
    url: new FormControl(),
    apiKey: new FormControl(),
    startTimeHour: new FormControl(),
    startTimeMin: new FormControl(),
    intervalTime: new FormControl(),
  });
  intervalUnit = 'Hours';

  times = [
    {
      "value": "Hours"
    },
    {
      "value": "Minutes"
    }];
  invalidCredentialMsg: string;

  constructor() {

  }

  ngOnInit() {
  }

  onFormSubmit() {
    
  }

}
