import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import * as _ from 'lodash';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  animations: [
    trigger('myAwesomeAnimation', [
      state('hide', style({
        height: 0,
      })),
      state('show', style({
        height: '*',
      })),
      transition('hide <=> show', animate('250ms ease-in')),
    ]),

  ]
})
export class MenuItemComponent implements OnInit {

  constructor(private router: Router, private _eleRef: ElementRef) { }

  ngOnInit() {
    setTimeout(() => {
      this.minWidth = this._eleRef.nativeElement.firstChild.offsetWidth;
    }, 100);
  }

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Input() item: any;
  @Input() active: string;
  isHoverSubmenu;
  state: string = 'hide';
  minWidth = 0;

  openMenu() {
    this.state = 'show';
  }

  closeMenu() {
    this.state = 'hide';
  }

  hoverMenu() {
    this.item.isHover = true;
    // this.trigger.openMenu();
    this.openMenu();
  }

  leaveMenu() {
    setTimeout(() => {
      this.item.isHover = false;
      if (!this.isHoverMenu()) {
        this.closeMenu();
      }
    }, 100);
  }

  hoverSubmenu() {
    if (this.isHoverMenu()) {
      this.isHoverSubmenu = true;
    }
  }
  leaveSubmenu() {
    this.isHoverSubmenu = false;
    if (!this.isHoverMenu()) {
      this.closeMenu();
    }
  }

  isHoverMenu() {
    return this.item.isHover || this.isHoverSubmenu;
  }

  showState() {
    if (this.item.type === 'toggle' && this.item.pages[0].url.length ) {
      this.router.navigate([this.item.pages[0].url]);
    } else if (this.item.url.length) {
      this.router.navigate([this.item.url]);
    }
  }
}
