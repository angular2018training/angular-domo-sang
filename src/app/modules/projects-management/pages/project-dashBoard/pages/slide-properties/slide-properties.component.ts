import { Component, OnInit, HostBinding, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-slide-properties',
  templateUrl: './slide-properties.component.html',
  styleUrls: ['./slide-properties.component.scss']
})
export class SlidePropertiesComponent implements OnInit {

  @HostBinding('class.component-content') true;

  @Output() changeSlideTypeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() slideStyle;

  // // slideProperties = ["Content", "Title", "Sub Title", "Background",  "Precondition"];
  // slideProperties = ["Content" , "Title", "Sub Title"];

  // // defaultSlideType = 0;

  // slideStyleDefault;

  slideTypes = [
    {
      value: 1,
      label: 'Content'
    },
    {
      value: 2,
      label: 'Title'
    },
    {
      value: 3,
      label: 'Sub Title'
    }
  ]


  constructor() {
   }

   changeSlideType() {

    // this.slideStyleDefault = this.slideProperties[i];
    this.changeSlideTypeEvent.emit(this.slideStyle);
   }

  ngOnInit() {
    // this.slideStyleDefault = this.slideStyle;
  }

}
