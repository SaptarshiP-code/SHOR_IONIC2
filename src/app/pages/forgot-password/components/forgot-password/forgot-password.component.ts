import { AuthService } from './../../../../shared/services/auth/auth.service';
import { Component, OnInit, asNativeElements } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from './../../../../shared/services/alert/alert.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  
  userType: String;
  resetPasswordForm: FormGroup;
  formSubmitted: Boolean;
  passwordType = 'password';
  otp: Number;
  isLoading = true;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService : AlertService,
    public translate: TranslateService,
    ) {
      const lang = sessionStorage.getItem("lang");
 
      translate.use(lang);
     }

  ngOnInit() {
        this.authService.logout();
    //this.route.paramMap.subscribe(params => {
    //  this.userType = params.get("type");
     // if(this.userType !=''){
        this.resetPasswordForm = this.formBuilder.group({
          userName: ['', [Validators.required]],
          otp: ['', [Validators.required]],
          password: ['', [Validators.required,Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[!@#$%^&*]).{8,30}')]],//(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
          cpassword: ['', [Validators.required]],

        });
      //}
    //});
  }

  get regf() {
    return this.resetPasswordForm.controls;
  }

  getOTP() {
    this.alertService.clear();
    if(this.resetPasswordForm.value["userName"] !=''){
      const userName = this.resetPasswordForm.value["userName"];
    this.authService
      .forgotPasswordOtp(userName)
     
      .subscribe(
        (data: any) => {
        
         // console.log(data, "data transfer succesful");
          if (data && data.success) {
            if(data.data["otp"])
            this.otp = data.data["otp"];          
        }},
        error => {
         // console.log(error, "ERROR sssssssssssssssssss");
          if (error !== null) {
           // console.log(error, "ERROR");
            this.alertService.error(error);
          }
        }
      );
    }
    else{
     // console.log("Mobile Number is not added for OTP");
      //this.alertService.error("Please fill mobile number",true);
      this.alertService.error('FORGOT_PASSWORD.USERNAME_REQUIRED',true);
    }
  }

  verifyEmailOTP() {
    this.formSubmitted = true;
   // console.log(this.registerForm.value,"this.registerForm.value");
    if(this.resetPasswordForm.value["password"] != this.resetPasswordForm.value["cpassword"]){
      this.alertService.error("REGISTRATION.BOTH_PASSWORD_SAME");
    }else if (this.resetPasswordForm.valid) {
    this.authService
      .resetPassword(this.resetPasswordForm.value)
      .pipe()
      .subscribe(
        (data: any) => {
          this.isLoading = false;
          //console.log(data, "data transfer succesful");
          if (data && data.success) {
          //  console.log(data);
              this.alertService.success("Password changed successfully", true);
              if(data.data.user.category == 'employer'){
                this.router.navigate([`/login/employer`]);
              }else{
                this.router.navigate([`/login/other`]);
              }
              
            
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
     // console.log(this.registerForm.errors,"Form is not valid");
     // console.log(this.regf,"Form Errors");
      this.alertService.error('COMMON.VALIDATION_FILL_ALL', true);
    }
  }

}
