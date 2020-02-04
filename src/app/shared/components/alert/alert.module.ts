import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "./alert.component";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AlertComponent],
  imports: [
    CommonModule,
    HttpClientModule,
     TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports : [
    AlertComponent
  ]
})
export class AlertModule { }
