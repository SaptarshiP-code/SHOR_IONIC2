import { NgModule } from '@angular/core';
  
import {ConfirmDialogComponent} from './../../components/confirm-dialog/confirm-dialog.component';  
import {ConfirmDialogService} from './../../services/confirm-dialog/confirm-dialog.service'; 
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

  
@NgModule({  
    declarations: [  
        ConfirmDialogComponent  
    ], 
    imports: [
          CommonModule,
          BrowserModule,
          HttpClientModule,
          TranslateModule.forChild({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ], 
    exports: [  
        ConfirmDialogComponent  
    ],providers:[  
       ConfirmDialogService  
    ]  
})  
export class ConfirmDialogModule  
{  
}  
