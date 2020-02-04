import { Component, OnInit, Input , OnDestroy } from '@angular/core';  
import { ConfirmDialogService } from "./../../services/confirm-dialog/confirm-dialog.service";  
import { TranslateService } from "@ngx-translate/core";
  
@Component({  
    selector: 'app-confirm-dialog',  
    templateUrl: './confirm-dialog.component.html',  
    styleUrls:  ['./confirm-dialog.component.scss']  
})  
export class ConfirmDialogComponent implements OnInit {  
    message: any;  
    constructor(  
        private confirmDialogService: ConfirmDialogService,
        public translate: TranslateService  
    ) { 
        const browserLang = translate.getBrowserLang();
        const lang = sessionStorage.getItem("lang");
     
        translate.use(lang);
    
    }  
  
    ngOnInit() {  
        //this function waits for a message from alert service, it gets   
        //triggered when we call this from any other component  
        this.confirmDialogService.getMessage().subscribe(message => {  
            this.message = message;  
        }); 
       // console.log(this.message ,"this.message ") ;
    }  
}  