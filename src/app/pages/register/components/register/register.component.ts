import { AuthService } from "./../../../../shared/services/auth/auth.service";
import { OtpService } from "./../../../../shared/services/register/otp.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Register } from "../../models/register";
import {Complainant} from "../../models/complainant";
//import { User } from "src/app/shared/user";
import { first } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { AlertService } from "./../../../../shared/services/alert/alert.service";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  isLoading: boolean;
  private registerModel: Register;
  complainantModal: Complainant;
  registerForm: FormGroup;
  
  otpForm: FormGroup;
 // private userModel: User;
  passwordType = "password";
  mobileOtp: string;
  emailOtp: string;
  emailId: string;
  mobileVerify: boolean = false;
  emailVerify: boolean = false;
  registrationStep: number = 0;
  otpSubmitted: boolean = false;
  emailVeficationSubmitted: boolean = false;
  notfication: string;
  mobileNumber: number;
  name: string;
  isComplainant: boolean = false;
  
  

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private otpService: OtpService,
    public translate: TranslateService,
    private alertService: AlertService
  ) {
    // const browserLang = translate.getBrowserLang();
    //translate.use(browserLang.match(/en|hn/) ? browserLang : 'en');
    const lang = sessionStorage.getItem("lang");
   // console.log("hello i am here", lang);

    translate.use(lang);
  }

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      mobileNumber: [
        "",
        [Validators.required, Validators.minLength(8), Validators.maxLength(15)]
      ],
      otp: ["", [Validators.required, Validators.minLength(6)]]
    });
    
  }

  get regf() {
    return this.registerForm.controls;
  }

  get otpf() {
    return this.otpForm.controls;
  }

  getOTP() {
    if(this.otpForm.value["mobileNumber"] !=''){
      this.alertService.clear();
      this.mobileNumber = this.otpForm.value["mobileNumber"];
    this.otpService
      .mobileVerification({ mobileNumber: this.otpForm.value["mobileNumber"],user:{category:localStorage.getItem('userTypeReq')} })
     
      .subscribe(
        (data: any) => {
          this.isLoading = false;
          if (data && data.success) {
            
            // this.mobileOtp = data.data["mobileOtp"]
            //   ? data.data["mobileOtp"]
            //   : data.data;
            this.emailId = data.data["emailId"];
            this.alertService.notification('NOTIFICATION.MOBILE_OTP_SENT');
            // setTimeout(() => {
            //   this.alertService.clear();
            // }, 13000);
            
            // this.registerForm.controls['emailId'].setValue(data.data['emailId']);
            //  this.registerForm.controls['name'].setValue(data.data['name']);
          }
          // if (data.error != "") {
          //   this.notfication = data.error;
          // }
        },
        error => {
         // console.log(error, "ERROR sssssssssssssssssss");
          if (error !== null) {
            this.isLoading = false;
           // console.log(error, "ERROR");
            this.alertService.error(error);
          }
        }
      );
    }
    else{
      // console.log("Mobile Number is not added for OTP");
       //this.alertService.error("Please fill mobile number",true);
       this.alertService.error('COMMON.VALIDATION_FILL_MOBILE',true);
     }
  }

  emailOtpOptional(){
    if(this.isComplainant == true){
      if(this.registerForm.value['emailId'] !=''){
        this.registerForm.get("otp").setValidators([Validators.required]);
        this.registerForm.get("otp").updateValueAndValidity();
      }else{
        this.registerForm.get("otp").clearValidators();
        this.registerForm.get("otp").updateValueAndValidity();
      }
    }
  }

  getOTPVerify() {
    this.otpSubmitted = true;
    if (this.otpForm.valid) {
      this.otpService
        .confirmMobileVerification(this.otpForm.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            this.isLoading = false;
           // console.log(data, "data transfer succesful");
            this.registrationStep =  0;
            if (data && data.success) {
              this.alertService.clear();
            //  console.log(data.data.emailId, "data transfer succesful");
            this.alertService.notification('NOTIFICATION.OTP_VERIFIED');
            // setTimeout(() => {
            //   this.alertService.clear();
            // }, 13000);
              this.mobileVerify = true;
              
              if(data.data.emailId){             
              this.mobileNumber = data.data.mobileNumber;
              this.emailId = data.data.emailId;
              if(data.data.organisation){
                this.name = data.data.organisation.name;
              }else{
                this.name = data.data.name;
              }
              
            //  console.log(data.data.emailId,"New Block");
              this.registerForm = this.formBuilder.group({
                name: [this.name , [Validators.required]],
                mobileNumber: [this.mobileNumber,Validators.required],
                emailId: [this.emailId, [Validators.required, Validators.email]],
                otp: ["", [Validators.required]],
                password: ["", [Validators.required,Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[!@#$%^&*]).{8,30}')] ],
                cpassword: ["", Validators.required],
                isComplainant:[false]
              });
              // this.registerForm.controls["name"].disable();
              // this.registerForm.controls["mobileNumber"].disable();
              // this.registerForm.controls["emailId"].disable();
              this.registrationStep = 1;
            }else{
              //console.log(data.data.emailId,"New Block111");
              this.isComplainant = true;
              this.registerForm = this.formBuilder.group({
                name: ['' , [Validators.required]],
                mobileNumber: [this.mobileNumber,Validators.required],
                emailId: ['', [Validators.email]],
                otp: '',//['', [Validators.required]],
                password: ['',  [Validators.required,Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[!@#$%^&*]).{8,30}')]],
                cpassword: ['', Validators.required],
                isComplainant:[true]
              });
              this.registrationStep = 1;
            }
              
            }
          },
          error => {
            if (error !== null) {
              this.isLoading = false;
             
              this.alertService.error(error);
            }
          }
        );
    }
    
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    this.alertService.clear();
    if (c.get('password').value !== c.get('cpassword').value) {
      this.alertService.error("REGISTRATION.BOTH_PASSWORD_SAME",true);
        return {invalid: true};
    }
}

  
  getEmailOTP() {
    this.alertService.clear();
    if (this.registerForm.value["emailId"] != "") {
      this.alertService.clear();
      this.otpService
        .emailVerification({ emailId: this.registerForm.value["emailId"] })
        .pipe(first())
        .subscribe(
          (data: any) => {
            
            this.isLoading = false;
            //console.log(data, "data transfer succesful");
            if (data && data.success) {
              this.alertService.notification('NOTIFICATION.EMAIL_OTP_SENT');
            //  console.log(data.data['mobileOtp']+'data transfer succesful' );
              //this.registerForm.setValue({'mobileOtp':"7919429516"});
              //this.setOtp(data.data['mobileOtp']);
              if(data.data["emailOtp"]){
              this.emailOtp = data.data["emailOtp"];
              }
            }
          },
          error => {
            if (error !== null) {
              this.isLoading = false;
             // console.log("ERROR" + error);
              this.alertService.error(error);
            }
          }
        );
    }else{
      this.alertService.error("ERROR.ENTER_EMAIL_NOTIFICATION");
    }
  }

  verifyEmailOTP() {
    this.emailVeficationSubmitted = true;
    this.alertService.clear();
    //console.log(this.registerForm.value,"this.registerForm.value");
    if(this.registerForm.value["password"]!='' && 
    this.registerForm.value["cpassword"]!='' && 
    (this.registerForm.value["password"] != this.registerForm.value["cpassword"])){
      this.alertService.error("REGISTRATION.BOTH_PASSWORD_SAME");
    }else if (this.registerForm.valid ){
      if(this.isComplainant == false ) {
        this.alertService.clear();
    this.otpService
      .confirmEmailVerification({
        emailId: this.registerForm.value["emailId"],
        otp: this.registerForm.value["otp"],
        password: this.registerForm.value["password"]
      })
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.isLoading = false;
          //console.log(data, "data transfer succesful");
          if (data && data.success) {
              this.alertService.success("Registration Completed Successfully", true);
              this.router.navigate([`/login/other`]);
          }
        },
        error => {
          if (error !== null) {
            this.isLoading = false;
           // console.log(error, "Error");
            this.alertService.error(error);
          }
        }
      );
    }else{
      //if(this.isComplainant == true){
        this.onRegister();
       // }
    }
  }
    // else{
    //  // console.log(this.registerForm.errors,"Form is not valid");
    //  // console.log(this.regf,"Form Errors");
    //   this.alertService.error('COMMON.VALIDATION_FILL_ALL', true);
    // }
  }
  backToStep(number:number){
    this.registrationStep = number;
  }
  
  onRegister() {
    this.emailVeficationSubmitted = true;
    if (this.registerForm.valid) {
      this.alertService.clear();
      //console.log("Calling Registration Service for the Complainant");
      this.isLoading = true;
      //  console.log(this.registerForm.value, 'from register');
      this.complainantModal = this.registerForm.value;
     // console.log(this.complainantModal,"Calling Registration Service for the Complainant");
      this.authService
        .complainantSignUp({
          name: this.registerForm.value["name"],
          mobileNumber: this.registerForm.value["mobileNumber"],
          emailId: this.registerForm.value["emailId"],
          otp: this.registerForm.value["otp"],
          password: this.registerForm.value["password"],
          isComplainant:true
        })
        .pipe(first())
        .subscribe(
          (data: any) => {
            this.isLoading = false;
            if (data && data.success) {
            //  console.log("Registration Successfully Completed" + data);
              this.alertService.success("Registration Completed Successfully", true);
              this.router.navigate([`/login/other`]);
            }
          },
          error => {
            if (error !== null) {
              this.isLoading = false;
              
              //console.log(error.error,"Errors");
             
              this.alertService.error(error);
            }
          }
        );
    }
  }
}
