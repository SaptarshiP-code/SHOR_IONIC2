import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { ResponseContentType, Http  } from '@angular/http'
import { saveAs } from 'file-saver';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base/base.service';
import { Complaint } from "../../../pages/complaints/models/complaint";


@Injectable({
  providedIn: 'root'
})
export class ComplaintsService extends BaseService {
  

  constructor(
    
    private http: HttpClient
    ) {
    super();
  }
  addComplaint(complainData:Complaint){
   // console.log(complainData,"addIccMembers Service Called");
        const url = `${environment.API}${environment.SHOR}/complaint`;
        return this.http.post(url, complainData).pipe(
          map((res: any) => {
           if (res && res.success) {
            //  this.sessionStorage.saveToken();
            // console.log(res,"Add complainData SuCCESS")
            }
            return res;
          })
        );
  }
  uploadFile(mobileNumber,id,data){
    //console.log(data,"Calling Service uploadFile");
    const HttpUploadOptions = {
      headers: new HttpHeaders({"accept":"application/json" })
    }
        const url = `${environment.API}${environment.SHOR}/complainant/${mobileNumber}/complaint/${id}`;
      //  console.log(data,"Calling Service uploadFile"+url);
        return this.http.put(url, data, HttpUploadOptions).pipe(
          map((res: any) => {
           if (res && res.success) {
            //  this.sessionStorage.saveToken();
           //  console.log(res,"Response of upload FIles")
            }else{
              console.log("NO success")
            }
            return res;
          })
        );
  }

  verify(){
    //console.log("Calling Verify Services");
    const url = `${environment.API}${environment.SHOR}/verify`;
    return this.http.get(url).pipe(
      map((res: any) => {
       // console.log(res,"Auth  verify")
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
          console.log("All  Organization")
         }
         return res.data;
       })
    );
  }

  listComplaints(mobileNumber:String,userCategory:String){
    let url: any ;
    if(userCategory == "icc" || userCategory == "employer" || userCategory == "do" || userCategory == "lcc" ){
      const id = JSON.parse(sessionStorage.getItem('currentUser')).data._id;
     // id= '5d3ed5403589d330f41074f3';
      url = `${environment.API}${environment.SHOR}/complaints/user/${id}`; 
    }else{
      url = `${environment.API}${environment.SHOR}/complaints/${mobileNumber}`;
    }
    
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
          console.log("All "+" Organization")
         }
         return res.data;
       })
    );
  }

  // public async getAttachment(id: String,name:String): Promise<Blob> {
  //   const url = `${environment.API}${environment.SHOR}/attachment/complaint/${id}/file/${name}`;
  //   const file =  await this.http.get<Blob>(url);
  //    console.log(file,"file");
  //   return file;
  // }

  getAttachment(id:String,name:string){
    const url = `${environment.API}${environment.SHOR}/attachment/complaint/${id}/file/${name}`;
    return this.http.get(url,{responseType: 'blob' as 'json'})
    .pipe(
      map((res: any) => {
        if (res && res.success) {
        saveAs(res);
         //  this.sessionStorage.saveToken();
        //  console.log(res,"All  Organization")
         }
         return res;
       })
    );
    
  }

  complaintDetail(id:String){
    const url = `${environment.API}${environment.SHOR}/complaint/${id}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
        //  console.log(res,"All "+id+" Organization")
         }
         return res.data;
       })
    );
  }

  getImage(url:string){
    return this.http.get(url,{responseType: 'blob' as 'json'}).pipe(
      map((res: any) => {
       // console.log(res,"All  Organization")
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
        //  console.log(res,"All "+id+" Organization")
         }
         return res;
       })
    );
  }



  disposeComplaint(disposeFormData:Complaint,id:String,userId:String){
    ///dispose/complaint/{id}/user/{userid}///action/complaint/{id}/user/{userid}
   // console.log(disposeFormData,"addIccMembers Service Called");
        const url = `${environment.API}${environment.SHOR}/dispose/complaint/${id}/user/${userId}`;
        return this.http.put(url, disposeFormData).pipe(
          map((res: any) => {
           if (res && res.success) {
            //  this.sessionStorage.saveToken();
           //  console.log(res,"Complaint Disposed Successfully")
            }
            return res;
          })
        );
  }

  actionComplaint(disposeFormData:Complaint,id:String,userId:String){
    ///dispose/complaint/{id}/user/{userid}///action/complaint/{id}/user/{userid}
    //console.log(disposeFormData,"addIccMembers Service Called");
        const url = `${environment.API}${environment.SHOR}/action/complaint/${id}/user/${userId}`;
        return this.http.put(url, disposeFormData).pipe(
          map((res: any) => {
           if (res && res.success) {
            //  this.sessionStorage.saveToken();
             console.log("Complaint Disposed Successfully")
            }
            return res;
          })
        );
  }

  transferComplaint(complaintId: String, userId:String,reason:any){

    const url = `${environment.API}${environment.SHOR}/transfer/complaint/${complaintId}/user/${userId}/`;
    return this.http.put(url,reason).pipe(
      map((res: any) => {
       if (res && res.success) {
        //  this.sessionStorage.saveToken();
         console.log("Complaint transfer Successfully")
        }
        return res;
      })
    );
  }
  
}


