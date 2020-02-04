//ionic cordova prepare android
//npm run build
//cordova run android
import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HeaderComponent } from './pages/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './pages/footer/footer.component';
//import {AlertComponent} from './shared/components/alert/alert.component';

//import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModule } from './shared/modules/confirm-dialog/confirm-dialog.module'
import {SliderModule} from './shared/modules/slider/slider.module';
import { ConfirmDialogService } from './shared/services/confirm-dialog/confirm-dialog.service';
//import { FaqComponent} from './pages/faq/components/faq/faq.component';
import {AccordionModule} from "ngx-bootstrap/accordion";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResourceComponent } from './pages/resources/components/resource/resource.component';
import { JwtInterceptor, ErrorInterceptor, LoadingScreenInterceptor } from './shared/helpers'
import { HistoryComponent } from './pages/history/history.component';
//import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';
import { LoadingScreenModule } from './shared/modules/loading-screen/loading-screen.module';
import {LoadingScreenService} from './shared/services/loading-screen/loading-screen.service';
import { DmdeskComponent } from './pages/dmdesk/dmdesk.component';
import { AlertModule } from "./shared/components/alert/alert.module";
import { ContactusComponent } from './pages/contactus/contactus.component';
import { PrivacypolicyComponent } from './pages/privacypolicy/privacypolicy.component';
import { OrgregistrationComponent } from './pages/orgregistration/orgregistration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// export function HttpLoaderFactory(httpClient: HttpClient) {
//   return new TranslateHttpLoader(httpClient);
// }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ResourceComponent,
    
    HistoryComponent,
   DmdeskComponent,
   ContactusComponent,
   PrivacypolicyComponent,
   OrgregistrationComponent
    
  ],
  imports: [
    AlertModule,
    BrowserAnimationsModule,
    LoadingScreenModule,
    NgbModule,
    ConfirmDialogModule,
    SliderModule,
    AccordionModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(),
  ],  
  exports: [  
      AccordionModule ,ConfirmDialogModule,SliderModule
      //,SliderComponent
  ],
  
  providers: [ConfirmDialogService, LoadingScreenService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingScreenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
 }
