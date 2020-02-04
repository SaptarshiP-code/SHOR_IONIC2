import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base/base.service';
import { Org } from 'src/app/pages/employer/models/org';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService  extends BaseService {

  constructor(
    private http: HttpClient) {
    super();
  }

  getOrganization(){
    const url = `${environment.API}${environment.SHOR}/organisation`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
          //console.log(res,"All Organization")
         }
         return res.data;
       })
    );
  }

  getOrganizationByCategory(category:string){
    const url = `${environment.API}${environment.SHOR}/organisation/${category}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
         // console.log(res,"All "+category+" Organization")
         }
         return res.data;
       })
    );
  }

  filterOrganization(category:string, pattern:String){
    ///org/{category}/name/{pattern}
    const url = `${environment.API}${environment.SHOR}/org/${category}/name/${pattern}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
         // console.log(res,"All "+category+" Organization")
         }
         return res.data;
       })
    );
  }

  registeredOrganization(category:string, pattern:String){
    ///org/{category}/name/{pattern}
    const url = `${environment.API}${environment.SHOR}/reg/org/${category}/name/${pattern}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
         // console.log(res,"All "+category+" Organization")
         }
         return res.data;
       })
    );
  }

  listPincode(){
    const url = `${environment.API}${environment.SHOR}/pincode`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
         // console.log(res,"All "+category+" Organization")
         }
         return res.data;
       })
    );
  }


  getOrganizationCategories(){
    const url = `${environment.API}${environment.SHOR}/org/categories`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
         // console.log(res,"All "+category+" Organization")
         }
         return res.data;
       })
    );
  }

  getOrganizationSubCategories(name){
    const url = `${environment.API}${environment.SHOR}/org/${name}/subcategories`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
         // console.log(res,"All "+category+" Organization")
         }
         return res.data;
       })
    );
  }
  getOrganizationRegistration(value: Org){
    const url = `${environment.API}${environment.SHOR}/org`;
    return this.http.post(url, value).pipe(
      map((res: any) => {
        if (res && res.success) {
         //  this.sessionStorage.saveToken();
         // console.log(res,"All "+category+" Organization")
         }
         return res.data;
       })
    );
  }


}
