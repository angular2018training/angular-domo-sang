import { element } from 'protractor';
import { UtilitiesService } from './../../services/utilities.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as _ from "lodash";
import * as NAV_CONSTANT from '../../constants/navigation.constant';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.module';
import { AuthService } from '../../services/auth.service';
import { SYSTEM} from '../../../core/constants/system.constant';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  private selectedMenu = {};
  private selectedSubmenu;
  private currentUrl;
  private titleObj = {};
  private parentObj = NAV_CONSTANT.MENU_MAPPING.PARENT;
  title = '';
  menu = _.cloneDeep(NAV_CONSTANT.MENU.ADMIN_SYSTEM);

  constructor(private router: Router, private utilitiesService: UtilitiesService, private breadcrumbService: BreadcrumbService, private _AuthService: AuthService) {
    this.getMenuByRole();
    this.buildMenuLanguage();

    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // get title of current page
          if (!this.currentUrl || this.currentUrl === '/') {
            this.currentUrl = event.urlAfterRedirects;
          } else {
            this.currentUrl = event.url;
          }
          //remove param
          if (this.currentUrl.indexOf("?") > -1) {
            this.currentUrl = this.currentUrl.substring(0, this.currentUrl.indexOf("?"))
          }
          this.initMenu();
          this.title = this.titleObj[this.currentUrl];
        }
      });

    this.utilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.buildMenuLanguage();
    });
  }

  getMenuByRole() {
    let user = this._AuthService.getLoggedInUser();
    if (user) {
      switch (user["useType"]) {
        case SYSTEM.ROLES.ADMIN:
          this.menu = NAV_CONSTANT.MENU.ADMIN_SYSTEM;
          break;
        case SYSTEM.ROLES.CONSULTANT:
        case SYSTEM.ROLES.SUPER_CONSULTANT:
          this.menu = NAV_CONSTANT.MENU.CONSULTANT;
          break;
        default:
          this.menu = NAV_CONSTANT.MENU.ADMIN_SYSTEM;
          break;
      }
    }

    _.forEach(NAV_CONSTANT.MENU_MAPPING.HIDE_TITLE, (title, pageUrl) => {
      this.breadcrumbService.hideRoute(title);
    });
    _.forEach(NAV_CONSTANT.MENU_MAPPING.HIDE_REGEX_TITLE, (title, pageUrl) => {
      this.breadcrumbService.hideRouteRegex(title);
    });
  }

  buildMenuLanguage() {
    this.menu.forEach(item => {
      this.utilitiesService.translateValue(item.tagLabel, null).subscribe(value => {
        if (value) {
          item['label'] = value[item.tagLabel];
        }
      });
      if (item['pages']) {
        item['pages'].forEach(pageItem => {
          this.utilitiesService.translateValue(pageItem.tagLabel[pageItem.tagLabel], null).subscribe(value => {
            if (value) {
              pageItem['label'] = value;
            }
          })
        });
      }
    });

    _.forEach(NAV_CONSTANT.MENU_MAPPING.TITLE_TAG, (tagTitle, pageUrl) => {
      this.utilitiesService.translateValue(tagTitle, null).subscribe(value => {
        if (value) {
          this.titleObj[pageUrl] = value[tagTitle];
          if (NAV_CONSTANT.MENU_MAPPING.REGEX_TITLE[pageUrl]) {
            this.breadcrumbService.addFriendlyNameForRouteRegex(NAV_CONSTANT.MENU_MAPPING.REGEX_TITLE[pageUrl], value[tagTitle]);
          } else {
            this.breadcrumbService.addFriendlyNameForRoute(pageUrl, value[tagTitle]);
          }
          if (pageUrl === this.currentUrl)
            this.title = value[tagTitle];
          // /facility/detail\?id=[0-9]*
        };
      });
    });
  }

  initMenu() {
    let idxSubmenu = 0,
      that = this,
      currentUrl = this.currentUrl,
      parentObj = this.parentObj,
      currentState = _.find(this.menu, function (menu) {
        if (menu['url']) {
          return menu['url'] === currentUrl || menu['url'] === parentObj[currentUrl] || that.getParentByRegex(menu['url']);
        } else {
          let subMenuIdx = _.findIndex(menu['pages'], (submenu) => {
            return submenu['url'] === currentUrl || submenu['url'] === parentObj[currentUrl] || that.getParentByRegex(submenu['url']);
          });
          if (subMenuIdx !== -1) {
            idxSubmenu = subMenuIdx;
            return true;
          }
        }
      });
    if (currentState) {
      this.selectedMenu = _.cloneDeep(currentState);
      this.utilitiesService.setScreenId(this.selectedMenu['screenId']);
      this.selectedSubmenu = this.selectedMenu['pages'] && this.selectedMenu['pages'][idxSubmenu];
    } else {
      this.selectedMenu = {};
    }
  }

  ngOnInit() {
  }

  getParentByRegex(menuUrl) {
    return _.some(this.parentObj, (parentUrl, childUrl) => {
      if (this.currentUrl.indexOf(childUrl) === 0) {
        return parentUrl === menuUrl;
      }
      return false;
    });
  }
}
