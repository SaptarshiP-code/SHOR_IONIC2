import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from '../services/auth/auth.service';
import { AlertService } from '../services/alert/alert.service'
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService,
        private alertService: AlertService,
        private router: Router,
        public translate : TranslateService) {
           
        }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
               // if(err.error == "Unauthorized"){
                   // this.alertService.errorNotification(err.error,true);
                    this.authenticationService.logout();
                    this.router.navigate([`/`]);
                    this.authenticationService.logout();
                    return throwError(err.error);
                    
              //  }
              
            }
            console.log(sessionStorage.getItem('lang'),"Group Error lang");
            const error =  err.error.message || err.error.error.message || err.statusText;
          // this.alertService.errorNotification(this.translate.instant('ERROR.'+error));
          if(this.translate.instant('ERROR.'+error) == 'ERROR.'+error){
            return throwError(error);
          }else{
            return throwError('ERROR.'+error);
          }
            
        }))
    }
}