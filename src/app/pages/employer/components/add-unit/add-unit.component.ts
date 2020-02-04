import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { UnitHeadService } from "../../../../shared/services/organization/unit-head.service";
//import { Units } from "./../../models/units";
import { AlertService } from "./../../../../shared/services/alert/alert.service";

@Component({
  selector: "app-add-unit",
  templateUrl: "./add-unit.component.html",
  styleUrls: ["./add-unit.component.scss"]
})
export class AddUnitComponent implements OnInit {
  addUnit: FormGroup;
  emailId: string;
  organisation: string;
  orgCode: string;
  orgAddress: string;
  mobile: number;
  name: string;
  // units: Units;
  employerName: String;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private unitHeadService: UnitHeadService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const userToken = JSON.parse(sessionStorage.getItem("userToken"));

    if (!sessionStorage.getItem("userToken")) {
      this.router.navigate([`/login/employer`]);
    }else if(userToken["user"]["category"] != "employer") {
      this.router.navigate([`/login/employer`]);
    } else {
     // console.log("Setting Default Values ");
      this.emailId = userToken.emailId;
      this.orgCode = userToken.organisation.regNumber;
      this.organisation = userToken.organisation.name;
      this.orgAddress = userToken.organisation.address;
      this.mobile = userToken.mobileNumber;
      this.employerName = userToken.name;
    }

    this.getUnits();
    this.addUnit = this.formBuilder.group({
      emailId: [this.emailId],
      organisation: [this.organisation],
      regNumber: [this.orgCode],
      unitName: [this.organisation],
      unitpincode: "",
      unitaddress: [ this.orgAddress],
      //sameAsEmployer: [""],
      headname: this.employerName,
      heademailId: this.emailId,
      headmobileNumber: this.mobile
    });
  }

  getUnits() {
    //console.log("getUnits");
   // organisation
   const userToken = JSON.parse(sessionStorage.getItem('userToken'));
   const organisationCode = userToken['organisation']['regNumber'];// "zabcdefsoftware07";// 
   // this.unitHeadService.getUnit();

    this.unitHeadService.getUnit(organisationCode).subscribe(
      (data: any) => {
        if(data[0]){
          this.router.navigate([`/employer`]);
        }
        //console.log(data, "data transfer successful");
      },
      error => {
        if (error !== null) {
          console.log(JSON.stringify(error), "ERROR");
        }
      }
    );
  }

  get f() {
    return this.addUnit.controls;
  }
  setEmployerAsHead() {

    if (this.addUnit.value["sameAsEmployer"] == true) {
      this.addUnit.patchValue({
        headname: "",
        heademailId: "",
        headmobileNumber: ""
      });
      this.addUnit.controls["headname"].enable();
      this.addUnit.controls["heademailId"].enable();
      this.addUnit.controls["headmobileNumber"].enable();
    } else {
      this.addUnit.patchValue({
        headname: this.employerName,
        heademailId: this.emailId,
        headmobileNumber: this.mobile
      });
      this.addUnit.controls["headname"].disable();
      this.addUnit.controls["heademailId"].disable();
      this.addUnit.controls["headmobileNumber"].disable();
    }
  }

  saveUnitDetails() {
    //this.units = this.addUnit.value;
    if (this.addUnit.valid) {
      if (this.addUnit.value["sameAsEmployer"] == true) {
        this.addUnit.controls["headname"].enable();
        this.addUnit.controls["heademailId"].enable();
        this.addUnit.controls["headmobileNumber"].enable();
      }
      var unitData = {
        emailId: this.addUnit.value["emailId"],
        organisation: this.addUnit.value["organisation"],
        regNumber: this.addUnit.value["regNumber"],
        unit: [
          {
            name: this.addUnit.value["unitName"],
            address: this.addUnit.value["unitaddress"],
            pinCode: this.addUnit.value["unitpincode"],
            head: {
              name: this.addUnit.value["headname"],
              emailId: this.addUnit.value["heademailId"],
              mobileNumber: this.addUnit.value["headmobileNumber"]
            }
          }
        ]
      };

      this.unitHeadService
        .addUnit(unitData)
        .pipe(first())
        .subscribe(
          (data: any) => {
            //console.log(data, "data transfer succesful");
            if (data && data.success) {
             // console.log(data, "Saved Successfully");
              this.alertService.success("Unit is Added Successfully", true);
              this.router.navigate([`/employer`]);
            }
          },
          error => {
            this.alertService.error(error);
            if (error !== null) {
             // console.log(error, "Error");
            }
          }
        );
    } else {
      this.alertService.error("Please fill all required Field", true);
    }
  }
}
