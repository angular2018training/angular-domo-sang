import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-layout-edit-dialog',
  templateUrl: './layout-edit-dialog.component.html',
  styleUrls: ['./layout-edit-dialog.component.scss']
})
export class LayoutEditDialogComponent implements OnInit {
  layouts = [
    {
      id: 1,
      label: 'Layout 001',
      src: 'assets/dash-board/chart-1.png'
    },
    {
      id: 2,
      label: 'Layout 002',
      src: 'assets/dash-board/chart-2.png'
    },
    {
      id: 3,
      label: 'Layout 003',
      src: 'assets/dash-board/chart-3.png'
    },
    {
      id: 4,
      label: 'Layout 004',
      src: 'assets/dash-board/chart-4.png'
    },
    {
      id: 5,
      label: 'Layout 005',
      src: 'assets/dash-board/chart-5.png'
    }
  ]

  constructor(
    public dialogRef: MatDialogRef<LayoutEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

  }
  saveFloorInfo() {
    // handle here
    this.dialogRef.close('Save');
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
