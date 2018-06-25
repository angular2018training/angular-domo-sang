import { Component, OnInit, ViewChild, ElementRef, Inject, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import * as _ from 'lodash';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';



@Component({
  selector: 'app-publish-confirm-dialog',
  templateUrl: './publish-confirm-dialog.component.html',
  styleUrls: ['./publish-confirm-dialog.component.scss']
})
export class PublishConfirmDialogComponent implements OnInit {
  @HostBinding('class.full-wh') true;
  
  constructor(
    public dialogRef: MatDialogRef<PublishConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }
  publishBuilding() {
    // handle here
    this.dialogRef.close('Save');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
