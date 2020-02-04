import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/auth/auth.service";
import * as CryptoJS from "crypto-js";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    
    const isApiUrl = request.url.startsWith(
      `${environment.API}${environment.SHOR}`
    );
   
    request = request.clone({ setHeaders: { "x-api-key": this.generateHash() } });
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          token: `${currentUser.token}`
        }
      });
    }

    return next.handle(request);
  }

  
  generateHash() {
    let key = CryptoJS.enc.Utf8.parse(environment.API_KEY);
    let buf = CryptoJS.enc.Utf8.parse(environment.ENC_KEY); //Buffer.from(base64Key, 'utf-8');
    const data = { timestamp: Date.now() };

    var encryptedStr = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: buf,
      keySize: 256,
      mode: CryptoJS.mode.CBC
    });

    
    return encryptedStr.ciphertext.toString(CryptoJS.enc.Base64);
  }


}
