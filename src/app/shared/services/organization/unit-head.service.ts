import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base/base.service';
import { Units } from './../../../pages/employer/models/units'

@Injectable({
  providedIn: 'root'
})
export class UnitHeadService extends BaseService {

  constructor(private http: HttpClient) {
      super();
  }


  getUnit(organisationCode:String){
    ///unit/organisation/{code}
    const url = `${environment.API}${environment.SHOR}/unit/organisation/${organisationCode}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
        //  console.log(res,"List Of Units")
         }
         return res.data;
       })
    );
  }

  addUnit(value: any) {
    //console.log(value,"addUnit Service Called");
    
    
        const url = `${environment.API}${environment.SHOR}/unit`;
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
}
