import { BaseModule } from './../../shared/modules/base/base.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './components/register/register.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AlertModule } from './../../shared/components/alert/alert.module';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { EmployerComponent } from './components/employer/employer.component';
import {DataTableModule} from "angular-6-datatable";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [RegisterComponent, EmployerComponent],
  imports: [
    DataTableModule,
    NgbModule,
    CommonModule,
    ShowHidePasswordModule,
    RegisterRoutingModule,
    BaseModule,
    AlertModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [BaseModule]
})
export class RegisterModule { }
