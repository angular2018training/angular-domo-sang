import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app.routing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { ContextMenuModule } from 'ngx-contextmenu';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/languages/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    ContextMenuModule.forRoot(),
    ContextMenuModule,
  ],
  exports: [
    CoreModule
  ],
  providers: [ TranslateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
