import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'preview-report',
  templateUrl: './preview-report.component.html',
  styleUrls: ['./preview-report.component.scss']
})
export class PreviewReportComponent implements OnInit {

  @HostBinding('class.component-content') true;

 

  constructor() {
   }

  ngOnInit() {
  }

}
