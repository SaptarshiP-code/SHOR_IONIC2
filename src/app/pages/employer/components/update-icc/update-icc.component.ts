import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CommitteeService } from "../../../../shared/services/committee/committee.service";
import { Icc } from "./../../models/icc";
import { AlertService } from "./../../../../shared/services/alert/alert.service";
//import { DatepickerOptions } from "./../../../../shared/components/ng-datepicker/ng-datepicker.component"
import { DatepickerOptions } from "ng2-datepicker";

@Component({
  selector: 'app-update-icc',
  templateUrl: './update-icc.component.html',
  styleUrls: ['./update-icc.component.scss']
})
export class UpdateIccComponent implements OnInit {

  organisation: String;
  addIccForm: FormGroup;
  icc: Icc;
  unitCode;
  unitName: any;
  orgCode: any;
  submitted = false;
  date: Date;
  readOnlyField: any;
  iccId: String;
  loadFormData = false;

  options: DatepickerOptions = {
    minYear: 2010,

    displayFormat: "DD[/]MM[/]YYYY", //'MMM D[,] YYYY',
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    //minDate: new Date(Date.now()), // Minimal selectable date
    maxDate: new Date(Date.now()), // Maximal selectable date
    barTitleIfEmpty: "Click to select a date",
    placeholder: "Click to select a date", // HTML input placeholder attribute (default: '')
    addClass: "form-control", // Optional, value to pass on to [ngClass] on the input field
    addStyle: {}, // Optional, value to pass to [ngStyle] on the input field
    fieldId: "my-date-picker", // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
  };
  iccData: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private committeeService: CommitteeService,
    private alertService: AlertService
  ) {
    this.date = new Date();
    this.readOnlyField = { gender: false };
  }

  ngOnInit() {
    const userToken = JSON.parse(sessionStorage.getItem("userToken"));

    if (!sessionStorage.getItem("userToken")) {
      this.router.navigate([`/login/employer`]);
    } else if (userToken["user"]["category"] != "employer") {
      this.alertService.error("Pleas login as Employer !!");
      this.router.navigate([`/login/employer`]);
    } else {
      this.organisation = userToken.organisation.name;
      this.orgCode = userToken.organisation.regNumber; //'zabcdefsoftware07';//
      this.unitName = localStorage.getItem("selectedUnitName");
      this.unitCode = localStorage.getItem("selectedUnit");
    }
    this.route.paramMap.subscribe(params => {
      this.iccId = params.get("id");
      this.getIcc(this.iccId);

      
    });


  }

  get f() {
    return this.addIccForm.controls;
  }

  updateIccMembers(id:String) {
    this.submitted = true;
   // console.log(this.addIccForm.value, "this.addIccForm.value");
    if (this.addIccForm.valid) {
      
     this.icc = this.addIccForm.value;

     // console.log(this.addIccForm.value, "this.addIccForm.value22222222222222");
      this.committeeService
        .updateIccMembers(id,this.icc)
        .pipe(first())
        .subscribe(
          (data: any) => {
          //  console.log(data, "data transfer succesful");
            if (data && data.success) {
            //  console.log(data, "Saved Successfully");
              this.alertService.success("ICC Member Added Successfully", true);
              this.router.navigate([`/employer/icc`]);
            }
          },
          error => {
            if (error !== null) {
             // console.log(error.error, "Error");
              this.alertService.error(error);
            }
          }
        );
    } else {
      this.alertService.error("Please fill all required Field", true);
    }
  }

  getIcc(id){
    // console.log("getIcc");
     const userToken = JSON.parse(sessionStorage.getItem('userToken'));
     const organisationCode =  userToken['organisation']['regNumber'];//'zabcdefsoftware07';//
     this.unitCode = localStorage.getItem('selectedUnit');//?localStorage.getItem('selectedUnit') :1449;

     this.committeeService.getUserDetails(id).subscribe(
       (data: any) => {
         this.iccData = data;
         //console.log( this.iccData," this.iccData");
        // console.log(this.iccData.name,"ssssssssssssssssssssscccccc");
         this.addIccForm = this.formBuilder.group({
          name: [this.iccData.name, [Validators.required]],
          mobileNumber: [this.iccData.mobileNumber, [Validators.required]],
          emailId: [this.iccData.emailId, [Validators.required]],
          designation: [this.iccData.designation, [Validators.required]],
          department: [this.iccData.department, [Validators.required]],
          experience: [this.iccData.experience, [Validators.required]],
          dateOfNomination: [this.iccData.dateOfNomination, [Validators.required]],
          gender: [this.iccData.gender, [Validators.required]],
          organisationName: [this.iccData.organisation.name, [Validators.required]],
          regNumber: [this.iccData.organisation.regNumber],
          unitName: [this.iccData.organisation.unit.name],
          unitCode: [this.iccData.organisation.unit.code],
          userCategory: ["icc"],
          userSubCategory: [this.iccData.user.subCategory]
        });
         this.loadFormData = true;
         
        
         //console.log(this.iccData, "ICC data transfer successful");
       },
       error => {
         if (error !== null) {
          // console.log(JSON.stringify(error), "ERROR");
         }
       }
     );

   }
  setValueByCategory() {
    if (this.addIccForm.value["userSubCategory"] == "employee" || this.addIccForm.value["userSubCategory"] == "chairperson") {
      //console.log(this.addIccForm, "sameAsEmployer");
      this.addIccForm.patchValue({ organisationName: this.organisation });
      this.addIccForm.controls["organisationName"].disable();
    } else {
      this.addIccForm.patchValue({ organisationName: "" });
      this.addIccForm.controls["organisationName"].enable();
    }

    if (this.addIccForm.value["userSubCategory"] == "chairperson") {
      //
    //  console.log(this.addIccForm, "sameAsEmployer");
      this.addIccForm.patchValue({ gender: "female" });
      // this.readOnlyField['gender'] = true;
      this.addIccForm.controls["gender"].disable();
    } else {
      this.addIccForm.patchValue({ gender: "" });
      this.readOnlyField["gender"] = false;
      this.addIccForm.controls["gender"].enable();
    }
  }
}
