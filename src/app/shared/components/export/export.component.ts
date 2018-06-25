import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  
  @Input() url: any;
  @Input() isDisabled: boolean;

  constructor() { }

  ngOnInit() {
  }

  clickMe() {
    if (this.isIE()) {
      document.execCommand('SaveAs', true, "data" + ".xls");
    } else {
      var link = document.createElement("a");
      link.download = name;
      link.href = 'data.xls';
      link.click();
    }
  }

  isIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie != -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
    {
      return true;
    } else { 
      return false;
    }
  }

}
