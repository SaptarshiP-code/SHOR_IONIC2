import { HttpClient } from "@angular/common/http";
import { SessionStorageService } from "./../sessionstorage/sessionstorage.service";
import { Injectable } from "@angular/core";
import { Login } from "src/app/pages/login/models/login";
// import { Complainant } from "src/app/pages/register/models/complainant";
// import { LoginResponse } from "src/app/pages/login/models/login-response";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { BaseService } from "../base/base.service";
import { AlertService } from "../../services/alert/alert.service";
import { Router } from "@angular/router";

import { BehaviorSubject, Observable } from "rxjs";

import { User } from "../../models/user";

@Injectable({
  providedIn: "root"
})
export class AuthService extends BaseService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private userId: string;
  private userCategory : string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService,
    private sessionStorage: SessionStorageService
  ) {
    super();
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(sessionStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();     
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  validateLogin() {
    if (this.sessionStorage.getSessionData()) {
      return JSON.parse(this.sessionStorage.getSessionData()).userCategory;
    } else {
      return false;
    }
  }

  validateAccess(roleArray: string[]) {
   
   
    const subscription =  this.currentUser.subscribe(currentUserData => {
      //console.log(currentUserData);
      if(currentUserData && currentUserData.data){
       // console.log(currentUserData.data, "Data Exist");
       // console.log(roleArray.includes(currentUserData.data.user.category),'roleArray.includes(currentUserData.data.user.category)'+currentUserData.data._id);
        if(roleArray.includes(currentUserData.data.user.category)){
          this.userId = currentUserData.data._id;
          this.userCategory = currentUserData.data.user.category;
         // return [{userId:this.userId,userCategory:this.userCategory}] 
        }
        // else{
        //   return false;
        // }
      }
      // else{
      //   return false;
      // }
    },
    error => {
      if (error !== null) {
        this.alertService.error(error, true);
      }
    }
    );
    if(subscription){
      return {userId:this.userId,userCategory:this.userCategory};
    }else{
      return false;
    }
  }

  unauthorizedRedirect(){
    //  this.logout();
      this.router.navigate(['/']);
  }

  logout() {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
  login(value: Login, userType: String) {
    // return this.http.Post('login', value).pipe(
    //   map((res: LoginResponse) => {
    //     if (res && res.success) {
    //       this.sessionStorage.saveToken(res);
    //     }
    //     return {
    //       accountId: this.sessionStorage.getSessionData(),
    //     };
    //   })
    // );
    let url;
    if (userType == "employer") {
      url = `${environment.API}${environment.SHOR}/employer/login`;
    } else {
      url = `${environment.API}${environment.SHOR}/login`;
    }
    // console.log(sessionStorage.getItem('lang'), "From Login Service");
    //console.log(url,"URL of API Service");
    return this.http.post(url, value).pipe(
      map((res: User) => {
        // if (res && res.success  && res.token) {
        if (res && res.success) {
          const lang = sessionStorage.getItem("lang");
          // console.log(lang, "Language from Service")
          this.sessionStorage.saveToken(res);
          localStorage.setItem("userCategory", res.data.user.category);
          localStorage.setItem("currentUser", JSON.stringify(res));
          localStorage.setItem("currentUser", JSON.stringify(res));
          sessionStorage.setItem("lang", lang);
          this.currentUserSubject.next(res);
          // console.log(this.sessionStorage.getSessionData(),"Session Data"+res.data.user.category+"res.data.data.user.category");
        }
        return {
          userData: localStorage.getItem("currentUser")
        };
      })
    );
  }
  complainantSignUp(complainant: any) {
    const url = `${environment.API}${environment.SHOR}/complainant`;

    return this.http.post(url, complainant).pipe(
      map((res: any) => {
        if (res && res.success) {
          //console.log(res,"Registration Response Data");
        }
        return res;
      })
    );
  }

  employerSignUp(complainant: any) {
    const url = `${environment.API}${environment.SHOR}/employer`;

    return this.http.post(url, complainant).pipe(
      map((res: any) => {
        if (res && res.success) {
          //console.log(res,"Registration Response Data");
        }
        return res;
      })
    );
  }

  forgotPasswordOtp(userName: String) {
    const url = `${environment.API}${environment.SHOR}/otp`;

    return this.http.post(url, { userName: userName }).pipe(
      map((res: any) => {
        if (res && res.success) {
          console.log("OTP Send");
        }
        return res;
      })
    );
  }

  resetPassword(userData: any) {
    const url = `${environment.API}${environment.SHOR}/password`;

    return this.http.put(url, userData).pipe(
      map((res: any) => {
        
        //{"success":true,"data":{"otp":1843,"user":{"category":"complainant"}}}
        if (res && res.success) {
          console.log("Successfully Reset Password");
        }
        return res;
      })
    );
  }
  // signup(value: any) {
  //   return this.http.post('user', value);
  // }
}