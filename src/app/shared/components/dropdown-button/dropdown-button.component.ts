import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface I_Item {
  id: Number,
  text: String,
  onClick: Function
}

@Component({
  selector: 'dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss'],
  animations: [
    trigger('dropDownState', [
      state('hide', style({
        display: 'none'
      })),
      state('show', style({
        display: 'block'
      })),
      transition('hide <=> show', animate('100ms ease-in')),
    ])
  ]
})
export class DropdownButton implements OnInit {
  @Input() className: String = '';
  @Input() noti: Boolean = false;
  @Input() deactive: Boolean = false;
  @Input() text: String = ''; // text of button label
  @Input() icon: String;
  @Input() items: Array<I_Item> = []; // texts on dropdown list
  @Input() btnClick: Function = () => { };
  constructor() { }

  ngOnInit() {
  }

  state = 'hide';
  openDropDown(_state: string) {
    this.state = _state === 'show' ? 'show' : 'hide';
  }

  clickOnItem(item) {
    item && item.onClick && item.onClick();
  }

}
