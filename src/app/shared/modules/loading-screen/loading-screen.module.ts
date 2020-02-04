import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent} from './../../components/loading-screen/loading-screen.component';
import { LoadingScreenService} from './../../services/loading-screen/loading-screen.service'
import {HttpClientModule} from '@angular/common/http';
//import { BrowserModule } from '@angular/platform-browser';

 @NgModule({
  declarations: [LoadingScreenComponent],
  imports: [
    CommonModule,
    //BrowserModule,
    HttpClientModule,
  ],
  exports: [  
    LoadingScreenComponent  
],providers:[  
   LoadingScreenService  
]  
})
export class LoadingScreenModule { }
