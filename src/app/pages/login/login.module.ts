import { BaseModule } from './../../shared/modules/base/base.module';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './components/login/login.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AlertModule } from './../../shared/components/alert/alert.module';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [LoginComponent],
  imports: [

    AlertModule,
    CommonModule,
    LoginRoutingModule,
    BaseModule,
    ShowHidePasswordModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginModule { }
