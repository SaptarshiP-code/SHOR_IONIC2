import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router } from "@angular/router";
import { AuthService } from "./../../shared/services/auth/auth.service";
import { AlertService } from "./../../shared/services/alert/alert.service";



@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing1.component.scss']
})
export class LandingComponent implements OnInit {
  currentUser:any;

  constructor(public translate: TranslateService,
    private authService:AuthService,
    private router: Router,
    private alertService: AlertService) {
    const browserLang = translate.getBrowserLang();
    if(!sessionStorage.getItem("lang")){
      sessionStorage.setItem('lang',browserLang);
    }
    const lang = sessionStorage.getItem("lang");
 
    translate.use(lang);
    this.authService.currentUser.subscribe(x => this.currentUser = x);

   }

  ngOnInit() {

  }

  navigateFileComplaint(){
     if(!this.currentUser || this.currentUser.data.user.category=="complainant"){
      this.router.navigate([`/complaints/add`]);
    }else{
     // alert("Login as complainant to Add complaint");
     // this.alertService.error("Login as complainant to Add complaint",true);
     this.alertService.error('ERROR_MSG.LOGIN_AS_COMPLAINANT');
      setTimeout(() => {
        this.alertService.clear();
      }, 2000);
      this.router.navigate([`/`]);
    }
    
  }

}
