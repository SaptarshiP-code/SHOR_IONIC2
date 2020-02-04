import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from './../../services/alert/alert.service';

@Component({ selector: 'alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getAlert()
            .subscribe(message => {
              //  console.log(message,"message from alert component");
                switch (message && message.type) {
                    case 'success':
                        message.cssClass = 'alert alert-success';
                        break;
                    case 'error':
                        message.cssClass = 'alert alert-danger';
                        break;
                    case 'notification':
                            message.cssClass = 'notification alert';
                            break;
                    case 'errorNotification':
                            message.cssClass = 'notification alert alert-danger notification';
                            break;
                }

                this.message = message;
            });
    }
    remove(){
        this.alertService.clear();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}