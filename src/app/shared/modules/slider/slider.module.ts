import { NgModule } from '@angular/core';
import {SliderComponent} from '../../components/slider/slider.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';  
//import { BrowserModule } from '@angular/platform-browser';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [SliderComponent],
  imports: [
   
    NgbCarouselModule,
    CommonModule,
          
          HttpClientModule,
          TranslateModule.forChild({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
  ],
  exports:[SliderComponent]
})
export class SliderModule { }
