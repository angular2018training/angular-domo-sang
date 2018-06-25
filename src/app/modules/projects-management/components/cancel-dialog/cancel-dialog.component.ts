import { Component, OnInit, ViewChild, ElementRef, Inject, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import * as _ from 'lodash';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-cancel-dialog',
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.scss']
})
export class CancelDialogComponent implements OnInit {
  @HostBinding('class.full-wh') true;
  
  constructor(private router: Router,
    public dialogRef: MatDialogRef<CancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }
  
  deleteProject() {
    // handle here
    this.dialogRef.close('Save');
    this.router.navigate(['/projects-management']);
  }

  closeDialog() {
    this.dialogRef.close('Close');
  }
}
