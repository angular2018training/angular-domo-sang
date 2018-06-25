import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-change-sensor-dialog',
  templateUrl: './change-sensor-dialog.component.html',
  styleUrls: ['./change-sensor-dialog.component.scss']
})
export class ChangeSensorDialogComponent implements OnInit {
  selectedItem = this.data.sensorsNotInLayout[0].sensorsList[0];
  filteredData: any[] = this.data.sensorsNotInLayout;
  filteredTotal: number = this.data.sensorsNotInLayout.length;  
  constructor(
    public dialogRef: MatDialogRef<ChangeSensorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.filter();
  }

  closeDialog() {
    this.dialogRef.close();
  }
  selectSensor(sensor){
    this.selectedItem = sensor;
  }
  changeSensor(){
    this.dialogRef.close(this.selectedItem);        
  }
  filter(): void {
    let newData: any[] = this.data.sensorsNotInLayout;
    newData = _.orderBy(newData, ['sensorType'], ['asc']);
    this.filteredTotal = newData.length;
    this.filteredData = newData;
  }
}
