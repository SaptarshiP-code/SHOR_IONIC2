import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { BaseModule } from './../../shared/modules/base/base.module';
import {TrainingRoutingModule} from './training-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DataTableModule} from "angular-6-datatable";
import { NgDatepickerModule } from 'ng2-datepicker';
import { AlertModule } from "./../../shared/components/alert/alert.module";
import { AmazingTimePickerModule } from 'amazing-time-picker'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddTrainingComponent } from './components/add-training/add-training.component';
import { ListTrainingComponent } from './components/list-training/list-training.component';
import { TrainingComponent } from './components/training/training.component';
import { SliderModule } from './../../shared/modules/slider/slider.module';
import { UpdateTrainingComponent } from './components/update-training/update-training.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  providers: [DatePipe],
  declarations: [AddTrainingComponent, ListTrainingComponent, TrainingComponent, UpdateTrainingComponent],
  imports: [
    
    NgbModule,
    AmazingTimePickerModule ,
    SliderModule,
    CommonModule,
    BaseModule,FormsModule,
    ReactiveFormsModule,
    AlertModule,
    DataTableModule,
    TrainingRoutingModule,
    HttpClientModule,
    NgDatepickerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TrainingModule { }
