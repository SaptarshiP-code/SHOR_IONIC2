import { Injectable } from '@angular/core';
import { LoginResponse } from 'src/app/pages/login/models/login-response';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  saveToken(res: LoginResponse) {
    if (res !== null && res.data !== null) {
      sessionStorage.clear();
      sessionStorage.setItem('userToken', JSON.stringify(res.data));
      sessionStorage.setItem('currentUser', JSON.stringify(res));
    }
  }
  getSessionData(): any {
    return sessionStorage.getItem('userToken') || null;
  }
  setItem(key:string,val:any){
    sessionStorage.setItem(key, val);
  }
  getItem(key:string){
    return sessionStorage.getItem(key);
  }

}
