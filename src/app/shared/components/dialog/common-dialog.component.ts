import { Component, OnInit, ViewChild, ElementRef, Inject, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss']
})
export class CommonDialogComponent implements OnInit {
  @HostBinding('class.full-wh') true;
  @Input() title: string;
  @Input() hideFooter: boolean;
  @Input() actions: any[];
  @Output()	onCloseHandler: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialogRef: MatDialogRef<any>) {}

  ngOnInit() {
    this.onCloseHandler;
  }

  closeDialog() {
    if (this.onCloseHandler) {
      this.onCloseHandler.emit([]);
    }
  }
}