import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-chart-add-dialog',
  templateUrl: './chart-add-dialog.component.html',
  styleUrls: ['./chart-add-dialog.component.scss']
})
export class ChartAddDialogComponent implements OnInit {

  businessUnits = [
    {
      id: 1,
      label: 'All'
    },
    {
      id: 2,
      label: 'Common'
    },
    {
      id: 3,
      label: 'Admid'
    },
    {
      id: 4,
      label: 'Hr'
    },
    {
      id: 5,
      label: 'Finance'
    },
    {
      id: 6,
      label: 'R&D'
    },
    {
      id: 7,
      label: 'Accounting'
    }
  ]
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
    public dialogRef: MatDialogRef<ChartAddDialogComponent>,
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
