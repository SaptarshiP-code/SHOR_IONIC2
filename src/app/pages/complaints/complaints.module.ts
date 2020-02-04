import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { BaseModule } from './../../shared/modules/base/base.module';
import {AddComplaintsComponent} from './component/add-complaints/add-complaints.component';
import {ComplaintsRoutingModule} from './complaints-routing.module';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTableModule} from "angular-6-datatable";
import { NgDatepickerModule } from 'ng2-datepicker';
import { AlertModule } from "./../../shared/components/alert/alert.module";
import { ListCompaintsComponent } from './component/list-compaints/list-compaints.component';
import { DetailComplaintComponent } from './component/detail-complaint/detail-complaint.component'
import { SearchPipe } from './search.pipe'
import { AmazingTimePickerModule } from 'amazing-time-picker'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {DpDatePickerModule} from 'ng2-date-picker';
import { TransferComplaintComponent } from './component/transfer-complaint/transfer-complaint.component';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  providers: [DatePipe],
  declarations: [AddComplaintsComponent, ListCompaintsComponent, DetailComplaintComponent,SearchPipe, TransferComplaintComponent],
  imports: [
    DpDatePickerModule,
    AngularFileUploaderModule,
    NgbModule,
    AmazingTimePickerModule ,
    CommonModule,
    BaseModule,FormsModule,
    ReactiveFormsModule,
    AlertModule,
    DataTableModule,
    ComplaintsRoutingModule,
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
export class ComplaintsModule { }
