import { Injectable } from '@angular/core';  
import { Router, NavigationStart } from '@angular/router';  
import { Observable,Subject } from 'rxjs';  


@Injectable() export class ConfirmDialogService  {

    constructor( private router : Router) {
   
    }  
    private subject = new Subject<any>();  
   
    confirmThis(message: string, siFn: () => void, noFn: () => void, closeModal:() => void) {  
        if(message=="login"){
            this.setConfirmation(message, siFn, noFn, closeModal);  
        }else{
            this.confirmDialog(message, siFn, noFn, closeModal);  
        }
        
    }  
    setConfirmation(message: string, siFn: () => void, noFn: () => void, closeModal:() => void) {  
        let that = this;  
        let objRouter = this.router;
        this.subject.next({  
            type: "confirm",  
            text: message,  
            siFn:  
                function () {
                    that.subject.next();  
                    
                    siFn();  
                   // window.open('/register', '_self');
                   objRouter.navigate([`/login/employer`]);
                 //  that.subject.next(); //this will close the modal  
                },  
            noFn: function () { 
                that.subject.next();   
                noFn();  
                objRouter.navigate([`/login/other`]);
                //window.open('/register', '_self');
                
            },
            closeModal:  function () {
                that.subject.next(); 
                closeModal();
            }
        });  
  
    } 
    
    confirmDialog(message: string, siFn: () => void, noFn: () => void, closeModal:() => void) {  
        let that = this;  
        this.subject.next({  
            type: "confirm",  
            text: message,  
            siFn:  
                function () {
                    that.subject.next();      
                    siFn();  
 
                },  
            noFn: function () { 
                that.subject.next();   
                noFn();  

                
            },
            closeModal:  function () {
                that.subject.next(); 
                closeModal();
            }
        });  
  
    }  

    confirmThreeThis(message: string, siFn: () => void, noFn: () => void,  thFn: () => void, closeModal:() => void) {  
        this.setThreeConfirmation(message, siFn, noFn, thFn, closeModal);  
    }  
    setThreeConfirmation(message: string, siFn: () => void, noFn: () => void, thFn: () => void, closeModal:() => void) {  
        let that = this;  
        let objRouter = this.router;
        this.subject.next({  
            type: "confirm",  
            text: message,  
            siFn:  
                function () {  
                    that.subject.next(); //this will close the modal  
                    siFn();  
                   // window.open('/register', '_self');
                   objRouter.navigate([`/register/employer`]);
                },  
            noFn: function () {  
                that.subject.next();  
                noFn();  
                objRouter.navigate([`/register/other`]);
                //window.open('/register', '_self');
            }  ,
            thFn: function () {  
                that.subject.next();  
                thFn();  
                objRouter.navigate([`/register/other`]);
                //window.open('/register', '_self');
            },
            closeModal:  function () {
                that.subject.next(); 
                closeModal();
            }
        });  
  
    }
  
    getMessage(): Observable<any> {  
        return this.subject.asObservable();  
    }  
}  