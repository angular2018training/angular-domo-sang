import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';
import { UtilitiesService } from './../../services/utilities.service';
/**
 * This component shows a breadcrumb trail for available routes the router can navigate to.
 * It subscribes to the router in order to update the breadcrumb trail as you navigate to a component.
 * *ngIf="_urls && _urls.length > 1"
 */
@Component({
  selector: 'breadcrumb',
  template: `
        <ul [class.breadcrumb]="useBootstrap" >
            <li *ngFor="let url of _urls; let last = last" [ngClass]="{'breadcrumb-item': useBootstrap, 'active': last}"> <!-- disable link of last item -->
                <a role="button" *ngIf="!last && url == prefix" (click)="navigateTo('/')">{{url}}</a>
                <a role="button" *ngIf="!last && url != prefix" (click)="navigateTo(url)">{{friendlyName(url)}}</a>
                <span *ngIf="last">{{friendlyName(url)}}</span>
                <span *ngIf="last && url == prefix">{{friendlyName('/')}}</span>
            </li>
            <!-- <div fxFlex></div>
            <span class="color-white" style="line-height: 28px;">{{_screenId}}</span> -->
        </ul>
    `,
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnChanges {
  @Input() useBootstrap: boolean = true;
  @Input() prefix: string = '';

  public _urls: string[];
  public _routerSubscription: any;
  public _screenId: string = 'Screen ID';

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private _UtilitiesService: UtilitiesService
  ) {
    this._routerSubscription = this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      if (navigationEnd instanceof NavigationEnd) {
        setTimeout(() => {
          if (this._urls) {
            this._urls.length = 0; //Fastest way to clear out array
            this.generateBreadcrumbTrail(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
          }
        }, 100);
      }
    });

    this._UtilitiesService.getScreenChangeEvent().subscribe(() => {
      this._screenId = this._UtilitiesService.getScreenId();
    });
  }

  ngOnInit(): void {
    this._urls = new Array();

    if (this.prefix.length > 0) {
      this._urls.unshift(this.prefix);
    }
  }

  ngOnChanges(changes: any): void {
    if (!this._urls) {
      return;
    }

    this._urls.length = 0;
    this.generateBreadcrumbTrail(this.router.url);
  }

  generateBreadcrumbTrail(url: string): void {
    if (!this.breadcrumbService.isRouteHidden(url)) {
      //Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
      if(url.lastIndexOf('?') > 0) {
        url = url.substr(0, url.lastIndexOf('?'));
      }
      this._urls.unshift(url);
    }
    if (url.lastIndexOf('/') > 0) {
      this.generateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/'))); //Find last '/' and add everything before it as a parent route
    } else if (this.prefix.length > 0) {
      this._urls.unshift(this.prefix);
    }
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  friendlyName(url: string): string {
    return !url ? '' : this.breadcrumbService.getFriendlyNameForRoute(url);
  }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }

}