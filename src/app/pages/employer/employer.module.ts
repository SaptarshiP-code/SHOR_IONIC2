import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModule } from './../../shared/modules/base/base.module';
import { UnitHeadComponent } from './components/unit-head/unit-head.component';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTableModule} from "angular-6-datatable";

import {EmployerRoutingModule} from './employer-routing.module';
import { AddUnitComponent } from './components/add-unit/add-unit.component';
import { IccComponent } from './components/icc/icc.component';
import { AddIccComponent } from './components/add-icc/add-icc.component';
import { AlertModule } from './../../shared/components/alert/alert.module';
//import { NgDatepickerModule } from './../../shared/modules/ng-datepicker/ng-datepicker.module';
import { NgDatepickerModule } from 'ng2-datepicker';
import { UpdateIccComponent } from './components/update-icc/update-icc.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [UnitHeadComponent, AddUnitComponent, IccComponent, AddIccComponent, UpdateIccComponent],
  imports: [
    CommonModule,
    BaseModule,
    AlertModule,
    DataTableModule,
    EmployerRoutingModule,
    HttpClientModule,
    NgDatepickerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class EmployerModule { }
