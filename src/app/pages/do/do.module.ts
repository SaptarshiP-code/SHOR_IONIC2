import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModule } from './../../shared/modules/base/base.module';

import { DoRoutingModule } from './do-routing.module';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTableModule} from "angular-6-datatable";
import { LccComponent } from './components/lcc/lcc.component'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModule } from './../../shared/components/alert/alert.module';
import { AddLccComponent } from './components/add-lcc/add-lcc.component';
import { NgDatepickerModule } from 'ng2-datepicker';
import { UpdateLccComponent } from './components/update-lcc/update-lcc.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [LccComponent, AddLccComponent, UpdateLccComponent],
  imports: [
    NgbModule,
    CommonModule,
    BaseModule,
    AlertModule,
    NgDatepickerModule,
    DataTableModule,
    DoRoutingModule,
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
export class DoModule  { }
