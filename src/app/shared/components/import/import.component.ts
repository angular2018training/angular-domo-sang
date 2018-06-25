import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  @Input() url: any;
  @Input() width: string = '400px';
  @Input() title: String = 'tags.import';
  @Input() isDisabled: boolean;
  
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  showAddDialog() {
    const dialogRef = this.dialog.open(ImportDialog, {
      width: this.width,
      disableClose: true,
      data: {
        title: this.title
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}

@Component({
  selector: 'import-dialog',
  templateUrl: 'import-dialog.html',
  styleUrls: ['./import.component.scss']
})
export class ImportDialog {
  fileName: any;
  disabled: false;
  actions = [
    { label: 'tags.cancel', onClick: this.closeDialog.bind(this) },
    { label: 'tags.upload', onClick: this.uploadHandle.bind(this) }
  ];

  constructor(
    public dialogRef: MatDialogRef<ImportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  selectEvent(file): void {
    if (file && file.name) {
      this.fileName = file.name;
    }
  }

  clickMe() {
    var link = document.createElement("a");
    link.download = name;
    link.href = 'test.html';
    link.click();
  }

  cancelEvent() {
    this.fileName = '';
  }

  uploadHandle() {
    // handle here
    this.dialogRef.close('Upload');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
