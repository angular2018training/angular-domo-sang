import { Component, OnInit, Inject, HostBinding } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-confirm-dialog-deleted',
  templateUrl: './confirm-dialog-deleted.dialog.html',
})
export class ConfirmDialogDeletedDialog implements OnInit {
 @HostBinding('class.full-wh') true;
  ngOnInit() { }
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }
}
