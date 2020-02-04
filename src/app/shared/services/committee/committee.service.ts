import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base/base.service';
import { Icc } from '../../../pages/employer/models/icc'

@Injectable({
  providedIn: 'root'
})
export class CommitteeService extends BaseService {

  constructor(
    private http: HttpClient) {
    super();
  }

  getCommitteByUnit(orgCode:String, unitCode:String){
    ///icc/org/{orgcode}/unit/{unitcode}

    const url = `${environment.API}${environment.SHOR}/icc/org/${orgCode}/unit/${unitCode}`;
  //  console.log(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
        //  console.log(res,"Committie Details")
         }
         return res.data;
       })
    );
  }

  getLcc(){
    ///icc/org/{orgcode}/unit/{unitcode}

    const url = `${environment.API}${environment.SHOR}/lcc`;
    //console.log(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         // console.log(res,"Committie Details")
         }
         return res.data;
       })
    );
  }

  addIccMembers(value:Icc){
    //console.log(value,"addIccMembers Service Called");
        const url = `${environment.API}${environment.SHOR}/committee`;
        return this.http.post(url, value).pipe(
          map((res: any) => {
           if (res && res.success) {
            //  this.sessionStorage.saveToken();
            // console.log(res,"addIccMembers SuCCESS")
            }
            return res;
          })
        );
  }

  updateIccMembers(id,value:any){
    //console.log(value,"addIccMembers Service Called");
        const url = `${environment.API}${environment.SHOR}/committee/user/${id}`;
        return this.http.put(url, value).pipe(
          map((res: any) => {
           if (res && res.success) {
            //  this.sessionStorage.saveToken();
            // console.log(res,"addIccMembers SuCCESS")
            }
            return res;
          })
        );
  }

  deleteUser(userId: String){
    const url = `${environment.API}${environment.SHOR}/user/${userId}`;
    return this.http.delete(url).pipe(
      map((res: any) => {
        // if (res && res.success) {
        //  // console.log(res,"Committie Details")
        //  }
         return res;
       })
    );
  }

  getUserDetails(id:String){
    ///icc/org/{orgcode}/unit/{unitcode}

    const url = `${environment.API}${environment.SHOR}/user/${id}`;
    //console.log(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         // console.log(res,"Committie Details")
         }
         return res.data;
       })
    );
  }
}
