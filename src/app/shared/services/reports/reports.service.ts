import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends BaseService  {

  constructor(
    
    private http: HttpClient
    ) {
    super();
  }

  annualReport(year:Number){
    const id = JSON.parse(localStorage.getItem('currentUser')).data._id;
    
    const url = `${environment.API}${environment.SHOR}/report/${year}/user/${id}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
          console.log("Annual Report for "+year)
         }
         return res.data;
       })
    );
  }

  complaintDetailsReport(year:Number, status:String, recieved:String){
   //const id = JSON.parse(localStorage.getItem('currentUser')).data._id;
      ///complaints/year/{year}/status/{status}/recieved/{recieved}
      const url = `${environment.API}${environment.SHOR}/complaints/year/${year}/status/${status}/recieved/${recieved}`;
      return this.http.get(url).pipe(
        map((res: any) => {
          // if (res && res.success) {
          // //  this.sessionStorage.saveToken();
          //   console.log(res,"Annual Report for "+year)
          // }
          return res.data;
        })
      );
  }
  organisationsReport(regstatus:String, iccstatus:String){
    //const id = JSON.parse(localStorage.getItem('currentUser')).data._id;
       ///complaints/year/{year}/status/{status}/recieved/{recieved}
       const url = `${environment.API}${environment.SHOR}/org/${regstatus}/icc/${iccstatus}`;
       
       return this.http.get(url).pipe(
         map((res: any) => {
           // if (res && res.success) {
           // //  this.sessionStorage.saveToken();
           //   console.log(res,"Annual Report for "+year)
           // }
           return res.data;
         })
       );
   }

}
