import { AuthService } from './../../../../shared/services/auth/auth.service';
import { Component, OnInit, asNativeElements } from '@angular/core';
import { Login } from '../../models/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from './../../../../shared/services/alert/alert.service';
import {ConfirmDialogService } from "./../../../../shared/services/confirm-dialog/confirm-dialog.service";
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading: boolean;
  loginModel: Login;
  loginForm: FormGroup;
  passwordType = 'password';
  error: boolean = false;
  errorMessage : String;
  submitted = false;
  returnUrl :String;
  userType: String = "";

  constructor(
    private confirmDialogService : ConfirmDialogService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService : AlertService,
    public translate: TranslateService,
    ) {
      const lang = sessionStorage.getItem("lang");
 
      translate.use(lang);
      this.set('aaa','aaa');
     }

     set(keys, value){
      var key = CryptoJS.enc.Utf8.parse(keys);
      var iv = CryptoJS.enc.Utf8.parse(keys);
      var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
  //console.log(encrypted.toString(),"encrypted.toString()");
      return encrypted.toString();
    }

  ngOnInit() {
    this.authService.logout();
    this.route.paramMap.subscribe(params => {
      this.userType = params.get("type");
      if(this.userType == "other"){
        this.loginForm = this.formBuilder.group({
          userName: ['', [Validators.required]],
          password: ['', [Validators.required]]
        });
      }else if(this.userType == 'employer'){
        this.loginForm = this.formBuilder.group({
          regNumber: ['', [Validators.required]],
          password: ['', [Validators.required]]
        });
      }else{
        // this.confirmDialogService.confirmThis("login", function () {  
        //   //  localStorage.setItem('loginTypeReq','employer');
        //    // console.log(this.userType,"Login as Employer");
        //   }, function () {  
        //    // localStorage.setItem('loginTypeReq','other');
        //   //  console.log(this.userType,"Login as Other");
        //   }, function () {  
    
        //   //  localStorage.removeItem('loginTypeReq');
        //     // console.log("Registerd for Other");
        //      //localStorage.setItem('userTypeReq','other');
        //    })  ;
        this.router.navigate([`/`]);
      }

    });
    
    if(!this.userType){
      this.confirmDialogService.confirmThis("login", function () {  
        //  localStorage.setItem('loginTypeReq','employer');
          //console.log("Login as Employer");
        }, function () {  
         // localStorage.setItem('loginTypeReq','other');
          //console.log("Login as Other");
        }, function () {  
  
        //  localStorage.removeItem('loginTypeReq');
          // console.log("Registerd for Other");
           //localStorage.setItem('userTypeReq','other');
         })  ;
    }
            // get return url from route parameters or default to '/'
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ;
            if(this.returnUrl == '/complaints/add'){
              localStorage.setItem('userTypeReq','complainant');
            }
           // console.log(this.returnUrl,"this.returnUrl");
  }

  // myFunction() {
  //   this.passwordType = 'password';
  // }

  get f() { return this.loginForm.controls; }

  onLogin(userType:String) {
   // console.log(this.loginForm.errors,"this.loginForm.valid");
    //console.log(sessionStorage.getItem('lang'), "From Login Component");
    this.submitted = true;
    if (this.loginForm.valid) {
      this.isLoading = true;
    //  this.loginModel = this.loginForm.value;
    //  console.log(this.loginModel, 'inside of Onlogin');
      this.authService.login(this.loginForm.value,userType).subscribe(
        data => {
          this.isLoading = false;
          const userToken = JSON.parse(data.userData);
          const userCategory = userToken.data.user.category; //localStorage.getItem('userCategory');//userToken.user.category;
          console.log(userCategory,"userCategory");
          console.log(this.returnUrl,"this.returnUrl");
          if(userCategory != "" && this.returnUrl ){
            this.router.navigate([this.returnUrl]);      
          }else if(userCategory == "employer"){
           this.router.navigate([`/employer`]);        
         }else if((userCategory == "do")){
          this.router.navigate([`/do`]);
         }else if((userCategory == "dpo")){
          this.router.navigate([`/report`]);
         }  else{ 
           this.router.navigate([`/complaints`]);
         }
          
        },
        error => {
          if (error !== null) {
            this.isLoading = false;
            this.alertService.error(error,true);
          }
        }
      );
    }
  }

  

}
