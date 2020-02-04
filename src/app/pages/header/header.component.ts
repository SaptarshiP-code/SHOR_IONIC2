import { Component, OnInit, } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SessionStorageService } from "./../../shared/services/sessionstorage/sessionstorage.service";
import { AuthService } from "./../../shared/services/auth/auth.service";
import { Router } from "@angular/router";
import {ConfirmDialogService } from "./../../shared/services/confirm-dialog/confirm-dialog.service"

import { User } from './../../shared/models/user';


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  language = "";
  loggedIn:boolean = false;
  userCategory: String;
  options: any = {
    confirmBtnClass: 'btn btn-success',      //DEFAULT VALUE
   confirmBtnText: 'Confirm',      				//DEFAULT VALUE
   cancelBtnClass: 'btn btn-danger',      //DEFAULT VALUE
   cancelBtnText: 'Cancel',      				//DEFAULT VALUE
   modalSize: 'lg',      							 //DEFAULT VALUE
   modalClass: ''      								//DEFAULT VALUE
  }
  userName:String;
  navbarOpen = false;

  
  constructor(
    public translate: TranslateService,
    private sessionStorage: SessionStorageService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private authService:AuthService
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    //console.log(this.currentUser,"current User");

    


  }
  
  ngOnInit() {
   const browserLang = this.translate.getBrowserLang();
    if (sessionStorage.getItem("lang")) {
      this.language = sessionStorage.getItem("lang");
      //console.log("hello language fetch from session", this.language);
      //this.translate.use(this.language);
    } 
    else {
      //translate.use(browserLang.match(/en|hn/) ? browserLang : 'en');
      this.language = browserLang.match(/en|hn/) ? browserLang : "hn";
      //console.log("hello language set in session", this.language);
      sessionStorage.setItem("lang",this.language);
     
    }
    //console.log(this.language,"Language Selected for  translation")
    this.translate.use(sessionStorage.getItem("lang"))
    const sessionData = this.sessionStorage.getSessionData();
    if(sessionData){
      this.loggedIn = true;
      const sessionDataObject = JSON.parse(sessionData);
      this.userCategory = sessionDataObject.user.category;// localStorage.getItem('userCategory');
      this.userName = sessionDataObject.name;
    //this.userCategory = this.sessionStorage.getSessionData()
     // this.userName = JSON.parse(localStorage.getItem('currentUser')).data.name;
    }
   
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  
  showDialog(page:String) {  
    if(page == 'register'){
      this.confirmDialogService.confirmThreeThis("register", function () {  
        //console.log("Registerd for Employer");
       
      }, function () {  
       // console.log("Registerd for Complainant");
        localStorage.setItem('userTypeReq','complainant');
      }, function () {  
       // console.log("Registerd for Other");
        localStorage.setItem('userTypeReq','other');
      }, function () {  
        localStorage.removeItem('userTypeReq');
        // console.log("Registerd for Other");
         //localStorage.setItem('userTypeReq','other');
       })  ;
    }
    if(page == 'login'){
      this.confirmDialogService.confirmThis("login", function () {  
      //  localStorage.setItem('loginTypeReq','employer');
      //  console.log("Login as Employer");
      }, function () {  
       // localStorage.setItem('loginTypeReq','other');
       // console.log("Login as Other");
      }, function () {  

        //  localStorage.removeItem('loginTypeReq');
        // console.log("Registerd for Other");
        //localStorage.setItem('userTypeReq','other');
       })  ;
    }
    
    
  } 
  
  
  logout(){
      this.authService.logout();
      this.loggedIn = false;
      this.router.navigate([`/`]);
     // window.open('/', '_self');
  }
  selectLanguage(language: string): void {
   // console.log("Called Select Language with " + language);
    this.sessionStorage.setItem("lang", language);
    this.language = language;
    this.translate.use(language);
    //window.location.reload();
  }

  onEnglish() {
   // this.selected = "blue";
    //console.log("english selected");
    this.selectLanguage("en");
  }

  onHindi() {
    // this.selected = "blue";
    //console.log("hindi selected");
    this.selectLanguage("hn");
  }
}
