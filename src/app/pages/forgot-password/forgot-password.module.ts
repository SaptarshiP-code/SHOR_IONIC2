import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { BaseModule } from './../../shared/modules/base/base.module';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AlertModule } from './../../shared/components/alert/alert.module';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    NgbModule,
    ForgotPasswordRoutingModule,
    BaseModule,
    ShowHidePasswordModule,
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
export class ForgotPasswordModule { }
