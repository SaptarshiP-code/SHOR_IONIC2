import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModule } from './../../shared/modules/base/base.module';
import { ReportRoutingModule } from './report-routing.module';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTableModule} from "angular-6-datatable";
import { ReportComponent } from './report.component';
//import { LoadingScreenComponent } from './../../shared/components/loading-screen/loading-screen.component';
import { LoadingScreenModule} from './../../shared/modules/loading-screen/loading-screen.module'



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    LoadingScreenModule,
    BaseModule,
    DataTableModule,
    ReportRoutingModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class ReportModule { }
