import { BaseModule } from './../../shared/modules/base/base.module';
import { FaqRoutingModule} from './faq-routing.module';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { FaqComponent} from './components/faq/faq.component';
import {AccordionModule} from "ngx-bootstrap/accordion";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [FaqComponent],
  bootstrap: [
    FaqComponent
],
  exports: [AccordionModule],
  imports: [
    FaqRoutingModule,
    FontAwesomeModule,
    AccordionModule.forRoot(),
    CommonModule,
    BaseModule,
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
export class FaqModule { }
