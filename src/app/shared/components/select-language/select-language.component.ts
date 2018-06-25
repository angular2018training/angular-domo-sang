import { Component, OnInit, Input } from "@angular/core";
import { SYSTEM } from './../../../core/constants/system.constant';
import { CookieService } from 'ngx-cookie-service';
import { UtilitiesService } from "../../../core/services/utilities.service";
import * as _ from "lodash";
import { TranslateService } from "@ngx-translate/core";
import { AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";

export const LANGUAGES = [{ name: 'English', value: 'en', image: 'assets/en.png' }, { name: 'Japanese', value: 'jp', image: 'assets/japan.png' }];

@Component({
  selector: 'select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss']
})
export class SelectLanguageComponent implements OnInit {

  constructor(private _UtilitiesService: UtilitiesService, private translateService: TranslateService, private cookieService: CookieService) {
  }

  @Input() onlyIcon: boolean;
  languages = LANGUAGES;
  language;
  selectedValue;

  ngOnInit() {
    this.language = this._UtilitiesService.getLanguage() || LANGUAGES[0];
    this.selectedValue = this.language.value;
  }

  // ngAfterViewInit() {
  //   this.language = this._UtilitiesService.getLanguage() || LANGUAGES[0];
  //   this.selectedValue = this.language.value;
  // }

  onLanguageChanged() {

    this.language = _.find(LANGUAGES, { value: this.selectedValue });
    // console.log(this.language);
    this._UtilitiesService.setLanguage(this.language);
  }

  onLanguageClick(item) {
    if (item.value !== this.language.value) {
      this.language = _.cloneDeep(item);
      this.selectedValue = this.language.value;
      this._UtilitiesService.setLanguage(this.language);
    }
  }
}