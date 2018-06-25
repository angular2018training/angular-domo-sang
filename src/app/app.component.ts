import { Component, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SYSTEM } from './core/constants/system.constant';
import { CookieService } from 'ngx-cookie-service';
import { UtilitiesService } from './core/services/utilities.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import * as cytoscape from 'cytoscape';
import * as contextMenus from 'cytoscape-context-menus';

@Component({ 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(private translateService: TranslateService, private _Utilities: UtilitiesService, private vcr: ViewContainerRef) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translateService.setDefaultLang('en');
    // translateService.setDefaultLang('jp');

    // if (this._Utilities.getLocalStorage(SYSTEM.LANGUAGE)) {
    //   let language = JSON.parse(this._Utilities.getLocalStorage(SYSTEM.LANGUAGE));
    //   this._Utilities.setLanguage(language);
    // }

    // this.toastr.setRootViewContainerRef(vcr);
  }
  ngOnInit() {
    contextMenus(cytoscape, $);
  }
}
