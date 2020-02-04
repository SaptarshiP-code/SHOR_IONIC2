import { BaseModule } from './../../shared/modules/base/base.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AlertModule } from "./../../shared/components/alert/alert.module";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



const routes: Routes = [
  { path: '', component: LandingComponent }
];

@NgModule({
  imports: [
    AlertModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CommonModule,
    RouterModule.forChild(routes),
    BaseModule
  ],
  declarations: [LandingComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingModule { }
