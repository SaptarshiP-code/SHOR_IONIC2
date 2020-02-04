import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatepickerOptions } from 'ng2-datepicker';

import { TrainingService } from "./../../../../shared/services/training/training.service";
import {AlertService} from "./../../../../shared/services/alert/alert.service";
import { AmazingTimePickerService } from 'amazing-time-picker';



@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent implements OnInit {

  options: DatepickerOptions = {
    minYear: 2010,
   
    displayFormat: 'DD[/]MM[/]YYYY', //'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    //minDate: new Date(Date.now()), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'DD / MM / YYYY', // HTML input placeholder attribute (default: '')
    addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
    addStyle: {}, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  addTraining: FormGroup;
  submitted: Boolean;
  userId: String;
  userCategory: String;
  
  constructor(
    private translate : TranslateService,
    private trainingService : TrainingService ,
    private router: Router,
    private datePipe: DatePipe,
    private alertService : AlertService,
    private formBuilder: FormBuilder,
    private atp: AmazingTimePickerService 
  ) { 
      //Setting up Translation 
      const lang = sessionStorage.getItem("lang");
      translate.use(lang);

  }

  ngOnInit() {
    const userToken = JSON.parse(sessionStorage.getItem("userToken"));
    if (!sessionStorage.getItem("userToken")) {
      this.router.navigate([`/login/other`]);
    }else if ((userToken["user"]["category"] !="")) {
      this.userCategory == userToken["user"]["category"];
      this.userId = userToken._id;
      
     
    } else {
      this.router.navigate([`/login/other`]);
      
    }

    this.addTraining =  this.formBuilder.group({
      type: ["", [Validators.required]],
      summary: ["", [Validators.required]],
      venue: ["", [Validators.required]],
      title: ["", [Validators.required]],
      date: ["", [Validators.required]],
      startTime: ["", [Validators.required]],
      endTime: ["", [Validators.required]],
      id: this.userId,
      status: "save" //
      
    });
  }
  get f(){
    return this.addTraining.controls;
  }
  open() {
    this.addTraining.patchValue({endTime:''});
    const amazingTimePicker = this.atp.open();
    //   {
        
    //     theme: 'dark',  // Default: 'light'
    //     rangeTime: {
    //         start: '00:00',
    //         end: this.addTraining.value['endTime']?this.addTraining.value['endTime']:'23:59',
    //     },
    //     arrowStyle: {
    //         background: 'red',
    //         color: 'white'
    //     }
    // }
    // );
    amazingTimePicker.afterClose().subscribe(time => {
      this.addTraining.patchValue({startTime:time});
    });
  }
  open1() {
    if(this.addTraining.value['startTime'] == ""){
      this.addTraining.get('endTime').setErrors({startTime:true});
      // this.addComplaintForm.get(key).setErrors({type:true});
    }else{

    const amazingTimePicker1 = this.atp.open(
      {
       
        time: this.addTraining.value['startTime'],
        rangeTime: {
            start: this.addTraining.value['startTime'],
            end: '23:59',
        }
    }
    );
    amazingTimePicker1.afterClose().subscribe(time => {
      this.addTraining.patchValue({endTime:time});
    });
  }
  }

  saveTraining(status){
    this.submitted = true;
    this.addTraining.patchValue({status:status});
    if (this.addTraining.valid) {
      
      
      //this.lcc = this.addTraining.value;
      this.trainingService
        .addTraining(this.addTraining.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
           // console.log(data, "data transfer succesful");
            if (data && data.success) {
             // console.log(data, "Saved Successfully");
              this.alertService.success('Training Added Successfully', true);
              this.router.navigate([`/trainings/list`]);
            }
          },
          error => {
            if (error !== null) {
             // console.log(error.error, "Error");
              this.alertService.error(error);
            }
          }
        );
    }
    
  }

}
