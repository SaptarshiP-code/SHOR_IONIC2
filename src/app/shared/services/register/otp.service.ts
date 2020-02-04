import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base/base.service';



@Injectable({
  providedIn: 'root'
})
export class OtpService extends BaseService {

  constructor(
    private http: HttpClient) {
    super();
  }

  mobileVerification(value: any) {
   // console.log(value,"mobileVerification Service Called");
    const url = `${environment.API}${environment.SHOR}/mobile/otp`;
    return this.http.post(url, value).pipe(
      map((res: any) => {
       // console.log(res,"OTP SuCCESS Response");
      //  if (res && res.success) {
      //   //  this.sessionStorage.saveToken();
      //    console.log("OTP SuCCESS")
      //   }
        
        return res;
      })
    );
  }
confirmMobileVerification(value: any) {
  //console.log(value,"confirmMobileVerification Service Called");
    const url = `${environment.API}${environment.SHOR}/verify/mobile/otp`;
    return this.http.post(url, value).pipe(
      map((res: any) => {
       if (res && res.success) {
        //  this.sessionStorage.saveToken();
        // console.log(res,"OTP SuCCESS")
        }
        return res;
      })
    );
  }

  emailVerification(value: any) {
    //console.log(value,"emailVerification Service Called");
    const url = `${environment.API}${environment.SHOR}/email/otp`;
    return this.http.post(url, value).pipe(
      map((res: any) => {
       if (res && res.success) {
        //  this.sessionStorage.saveToken();
       //  console.log("OTP SuCCESS")
        }
        return res;
      })
    );
  }

  confirmEmailVerification(value: any) {
    //console.log(value,"confirmEmailVerification Service Called");
        const url = `${environment.API}${environment.SHOR}/verify/email/otp`;
        return this.http.post(url, value).pipe(
          map((res: any) => {
           if (res && res.success) {
            //  this.sessionStorage.saveToken();
             //console.log(res,"OTP SuCCESS")
            }
            return res;
          })
        );
      }

}
