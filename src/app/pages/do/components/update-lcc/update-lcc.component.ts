import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { Router,ActivatedRoute } from "@angular/router";
import { CommitteeService } from "../../../../shared/services/committee/committee.service";
import { Icc } from './../../../employer/models/icc';
import {AlertService} from "./../../../../shared/services/alert/alert.service";
import { DatepickerOptions } from 'ng2-datepicker';

@Component({
  selector: 'app-update-lcc',
  templateUrl: './update-lcc.component.html',
  styleUrls: ['./update-lcc.component.scss']
})
export class UpdateLccComponent implements OnInit {

  addLccForm: FormGroup;
  lcc: any;
  unitCode;
  unitName: any;
  orgCode: any;
  submitted = false;
  date: Date;
  
  options: DatepickerOptions = {
    minYear: 2010,
   
    displayFormat: 'DD[/]MM[/]YYYY', //'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    //minDate: new Date(Date.now()), // Minimal selectable date
    maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
    addStyle: {}, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  readOnlyField: any;
  lccId:String;
  lccData: any;
  loadFormData = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private committeeService: CommitteeService,
    private alertService : AlertService
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.lccId = params.get("id");
      this.getLcc(this.lccId);

      
    });



  }

  get f() {
    return this.addLccForm.controls;
  }

  getLcc(id){
     this.committeeService.getUserDetails(id).subscribe(
       (data: any) => {
         this.lccData = data;
         //console.log( this.lccData," this.lccData");
         
         this.addLccForm = this.formBuilder.group({
          name: [this.lccData.name, [Validators.required]],
          mobileNumber: [this.lccData.mobileNumber, [Validators.required]],
          emailId: [this.lccData.emailId, [Validators.required]],
          designation: [this.lccData.designation, [Validators.required]],
          department: [this.lccData.department, [Validators.required]],
          experience: [this.lccData.experience, [Validators.required]],
          dateOfNomination: [this.lccData.dateOfNomination, [Validators.required]],
          gender: [this.lccData.gender, [Validators.required]],
        //  organisationName: [this.lccData.organisation.name, [Validators.required]],
         // regNumber: [this.lccData.organisation.regNumber],
        //  unitName: [this.lccData.organisation.unit.name],
        //  unitCode: [this.lccData.organisation.unit.code],
      //    userCategory: ["lcc"],
          userSubCategory: [this.lccData.user.subCategory]
        });
         this.loadFormData = true;
         
        
         //console.log(this.lccData, "ICC data transfer successful");
       },
       error => {
         if (error !== null) {
          // console.log(JSON.stringify(error), "ERROR");
         }
       }
     );

   }
  
   updateLccMembers(id) {
    this.submitted = true;
    if (this.addLccForm.valid) {
      
     
      this.lcc = this.addLccForm.value;
      this.committeeService
        .updateIccMembers(id,this.lcc)
        .pipe(first())
        .subscribe(
          (data: any) => {
           // console.log(data, "data transfer succesful");
            if (data && data.success) {
            //  console.log(data, "Saved Successfully");
              this.alertService.success('LCC Member Added Successfully', true);
              this.router.navigate([`/do`]);
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

  setValueByCategory() {
    //console.log("setValueByCategory");
    if(this.addLccForm.value["userSubCategory"] == "chairperson" || this.addLccForm.value["userSubCategory"] == "member"){
      //
     // console.log(this.addLccForm,"sameAsEmployer");
      this.addLccForm.patchValue({'gender':"female"});
     // this.readOnlyField['gender'] = true;
      this.addLccForm.controls["gender"].disable();
      
    }else{
      this.addLccForm.patchValue({'gender':''});
     // this.readOnlyField['gender'] = false;
      this.addLccForm.controls["gender"].enable();
    }
  }

}
