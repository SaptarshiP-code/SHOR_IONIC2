import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { OrganizationService } from "./../../../../shared/services/organization/organization.service";
import { CommitteeService } from "./../../../../shared/services/committee/committee.service";
import { UnitHeadService } from "./../../../../shared/services/organization/unit-head.service";
//import { DatepickerOptions } from "ng2-datepicker";
import { Complaint } from "./../../models/complaint";
import { ComplaintsService } from "./../../../../shared/services/complaints/complaints.service";
import { AlertService } from "./../../../../shared/services/alert/alert.service";
import { IDatePickerConfig } from "ng2-date-picker";

@Component({
  selector: "app-add-complaints",
  templateUrl: "./add-complaints.component.html",
  styleUrls: ["./add-complaints.component.scss"]
})
export class AddComplaintsComponent implements OnInit {
  showOrgTable = false;
  submitted = false;
  addComplaintFormError = {};
  addComplaintForm: FormGroup;
  iccDetails: any;
  self: boolean = true;
  other: boolean = false;
  unitDetails: boolean = false;
  uploadFormData: FormData;
  tooltipText: any;
  showHelpText: boolean = false;
  pinCode: any ;
 
  dtOptions: IDatePickerConfig;
  
  complainData: Complaint;

  stepOne: boolean = true;
  code: String = "";
  stepOneSumbitted: boolean = false;

  steptwo: boolean = false;
  stepTwoSumbitted: boolean = false;

  stepNumberSubmitted: Number = 0;

  stepNumber: number = 1;
  selectedReason: String;
  errorCount = 0;
  organizationData: any;
  workPlaceCategory: any;
  columns;
  rows: any;
  unitData: any;
  unit: boolean = false;
  organization: boolean = false;

  selectedorgData = {};
  selectedOrgCode: string = "";
  selectedUnit: any;
  name: string;
  mobileNumber: String;
  emailId: String;
  relationsships = [];
  complaint: FormArray;
  respondent: FormArray;
  miscellaneous = false;
  tableList: boolean = true;
  showReasonBox: any = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private organizationService: OrganizationService,
    private committeeService: CommitteeService,
    private unitHeadService: UnitHeadService,
    private complaintsService: ComplaintsService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) {
    // const browserLang = translate.getBrowserLang();
    //translate.use(browserLang.match(/en|hn/) ? browserLang : 'en');
    const browserLang = translate.getBrowserLang();

    if (!sessionStorage.getItem("lang")) {
      sessionStorage.setItem("lang", browserLang);
    }
    const lang = sessionStorage.getItem("lang");

    translate.use(lang);
    
  }

  ngOnInit() {
    const userToken = JSON.parse(sessionStorage.getItem("userToken"));
    if (!sessionStorage.getItem("userToken")) {
      this.router.navigate([`/login/other`]);
    } else if (userToken["user"]["category"] != "complainant") {
      this.alertService.error("Pleas login as Complainant !!",true);
      this.router.navigate([`/`]);
    } else {
      //console.log("Not Complainant Type User");
      this.name = userToken.name;
      this.emailId = userToken.emailId;
      this.mobileNumber = userToken.mobileNumber;

    }
    
    this.uploadFormData = new FormData();
    this.listPincode();
    this.addComplaintForm = this.formBuilder.group({
      mobileNumber: ["", [Validators.required]],
      emailId: [""],
      self: ["", [Validators.required]],
      relationship: "",
      orgCategory: ["", [Validators.required]],
      pattern: "",
      reason: "",
      name: "",
      regNumber: "",
      orgName: "",
      orgMobileNumber:"",
      orgAddress: "",
      unitDetail: "",
      orgunit: "",
      orgPinCode: "",
      unitCode: "",
      governmentId: ["", [Validators.required]],
      writtenComplaint: ["", [Validators.required]],
      complainantId: [""],
      consent: [""],
      complainant: this.formBuilder.group({
        name: [""]
      }),
      respondentEmployer: ["", [Validators.required]],
      respondent: this.formBuilder.array([this.createRespondentForm()]),
      complaint: this.formBuilder.array([this.createComplaintForm()]),
      expectedAction: ["", [Validators.required]]
      // respondent: this.formBuilder.array([]),
      // complaint: this.formBuilder.array([])
    });

    this.dtOptions = {
      format: "MM/DD/YYYY",
      max: this.datePipe.transform(new Date(Date.now()), "MM/dd/yyyy"),
      firstDayOfWeek: "su",
      drops:"down",
      opens:"right",
      disableKeypress:true
    };


    this.workPlaceCategory = this.getworkPlaceCategory();
    // console.log(this.workPlaceCategory, "this.workPlaceCategory");

    this.addComplaintForm.patchValue({
      name: this.name,
      emailId: this.emailId,
      mobileNumber: this.mobileNumber
    });
    
    
  }

  getHelpToggle(){
    this.showHelpText =! this.showHelpText;
  }
  onCloseToggle(){
  this.showHelpText = false;
}
  removeFile(controlName) {
    const patchArray = {};
    patchArray[controlName] = "";
   // console.log(patchArray, "patchArray");
    this.addComplaintForm.patchValue(patchArray);
    this.addComplaintForm.get(controlName).updateValueAndValidity();
  }

  onFileChange(event, key) {
    const extensionArray = ["png", "PNG", "jpg", "pdf", "doc", "docx", "JPEG", "jpeg", "JPG", "PDF"];
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      //console.log(file, "file");
      reader.readAsDataURL(file);
      reader.onload = () => {
        const extensionarr = file.name.split("."); //.toLowerCase();
        const extension = extensionarr[extensionarr.length-1]
        // console.log(2**21,"extensionextensionextensionextension" );
        if (extensionArray.includes(extension) == false) {
          this.addComplaintForm.get(key).setErrors({ type: true });
        } else if (file.size > 2 ** 21) {
          this.addComplaintForm.get(key).setErrors({ size: true });
        } else {
          this.addComplaintForm.get(key).setValue(file);
          this.uploadFormData.set(key, file, file.name);
        }
        // console.log(this.uploadFormData,"this.uploadFormData");
        //this.addComplaintForm.get(key).setErrors({size:true,type:true});

        // console.log(
        //   this.uploadFormData.getAll(key),
        //   "this.uploadFormData" + key
        // );
      };
    }
  }
  createComplaintForm() {
    return this.formBuilder.group({
      date: ["", [Validators.required]],
      time: "",
      description: "",
      location: "",
      lateReason: ""
    });
  }

  createRespondentForm() {
    return this.formBuilder.group({
      name: ["", [Validators.required]],
      relationship: [""],
      department: [""],
      designation: [""]
    });
  }
  addRespondent(): void {
    this.respondent = this.addComplaintForm.get("respondent") as FormArray;
    this.respondent.push(this.createRespondentForm());
  }
  removeRespondent(i) {
    this.respondent = this.addComplaintForm.get("respondent") as FormArray;
    this.respondent.removeAt(i);
  }

  addItem(): void {
    this.complaint = this.addComplaintForm.get("complaint") as FormArray;
    this.complaint.push(this.createComplaintForm());
  }
  removeComplaintForm(i) {
    this.complaint = this.addComplaintForm.get("complaint") as FormArray;
    this.complaint.removeAt(i);
  }

  addComplaint() {
    this.stepNumberSubmitted = 4;

    const dd = this.addComplaintForm.value.complaint;

    // console.log(dd, "dd.complaint.length");
    for (let i = 0; i < dd.length; i++) {
      const linesFormArray = this.addComplaintForm.get("complaint").value[
        i
      ] as FormGroup;
      const typeCheck: Date = linesFormArray["date"];
      linesFormArray["date"] = this.datePipe.transform(typeCheck, "MM/dd/yyyy");
    }

    if (this.addComplaintForm.valid) {
      this.complainData = this.addComplaintForm.value;
      delete this.complainData["governmentId"];
      delete this.complainData["writtenComplaint"];
      delete this.complainData["complainantId"];
      delete this.complainData["consent"];

      // console.log(this.addComplaintForm, "this.addComplaintForm.value");
      this.complaintsService.addComplaint(this.complainData).subscribe(
        (data: any) => {
          // console.log(data, "data transfer successful");
          if (data && data.success) {
            //  console.log(data, "Saved Successfully");
            this.uploadFiles(data.data.mobileNumber, data.data.id);
            this.alertService.success('NOTIFICATION.COMPLAINT_ADD_SUCCESS_'+data.data.complaintViewer.toLowerCase(),true);
            //this.alertService.success("Complaint created successfully and assigned to "+data.data.complaintViewer, true);
            //this.router.navigate([`/complaints/`]);
          }
        },
        error => {
          if (error !== null) {
            console.log(error, "Error");
            this.alertService.error(error,true);
          }
        }
      );
    } else {
      this.stepOneSumbitted = true;
      this.submitted = true;
      this.stepNumber = 4;
    }
  }
  uploadFiles(mobileNumber, id) {
    this.complaintsService
      .uploadFile(mobileNumber, id, this.uploadFormData)
      .subscribe(
        (data: any) => {
          if (data && data.success) {
            // console.log(data, "Saved Successfully");
            this.alertService.success("Documents uploaded successfully", true);
            this.router.navigate([`/complaints/`]);
          }
        },
        error => {
          if (error !== null) {
            console.log(error.error, "Error");
            this.alertService.error(error, true);
          }
        }
      );

    //console.log(aa,"Retured Response");
  }
  getUnits(selectedOrg: any) {
    this.addComplaintForm.patchValue({
      unitDetail: ""
    });
    this.addComplaintForm.get("unitDetail").clearValidators();
    this.addComplaintForm.get("unitDetail").updateValueAndValidity();

    //console.log("Called Get Unit Function");
    this.selectedOrgCode = selectedOrg.registrationNumber;
    this.unitData = "";
    this.iccDetails = "";
    this.unit = false;
    this.unitDetails = false;
    this.selectedorgData["org"] = {
      name: selectedOrg.orgName,
      code: selectedOrg.registrationNumber
    };
    // this.selectedorgData["org"]["code"] = selectedOrg.code;

    this.addComplaintForm.patchValue({
      unitCode: "",
      regNumber: selectedOrg.registrationNumber
    });

    this.unitHeadService.getUnit(this.selectedOrgCode).subscribe(
      (data: any) => {
        //this.organizationData = data;
        //(data, "data transfer successful");
        //console.log(data["0"].unit, "data.unit[0].unit");
        //console.log(selectedOrg, "selectedOrg");
        //this.iccDetails = data;
        // this.unitData = selectedOrg.unit;
        if (data["0"]) {
          this.unitData = data["0"].unit;

          this.addComplaintForm.controls["unitDetail"].setValidators([
            Validators.required
          ]);
          this.addComplaintForm.get("unitDetail").updateValueAndValidity();
          this.unit = true;
        }
        // else {
        //   //orgAddress
        //   this.addComplaintForm.patchValue({
        //     orgAddress: selectedOrg.orgAddress
        //   });
        // }
      },
      error => {
        if (error !== null) {
          //console.log(JSON.stringify(error), "ERROR");
        }
      }
    );

    //console.log(this.selectedorgData, "ddd");
    //console.log(selectedOrg.unit, "units");
    //this.unitData = selectedOrg.unit;
  }


  orgCategory(name: String) {
    // this.tooltipText="hhhh"
    this.miscellaneous = false;
    const tooltipArray = this.getworkPlaceCategory().filter(item => {
      return item.id === name;
    });
    this.tooltipText = tooltipArray[0].tooltip;
   // console.log(this.tooltipText, "Selected Category");
    this.addComplaintForm.patchValue({
      orgunit: "",
      unitDetail: ""
    });
    this.addComplaintForm.get("orgunit").clearValidators();
    this.addComplaintForm.get("orgunit").updateValueAndValidity();
    this.addComplaintForm.get("unitDetail").clearValidators();
    this.addComplaintForm.get("unitDetail").updateValueAndValidity();
    this.addComplaintForm.patchValue({
      unitCode: "",
      regNumber: ""
    });
    this.selectedOrgCode = "";
    this.organization = false;
    this.organizationData = "";
    this.unit = false;
    this.unitData = "";
    this.iccDetails = null;
    this.unitDetails = false;
    if (name == "lessthanten" || name == "private" || name == "government") {
      this.addComplaintForm.controls["pattern"].setValidators([
        Validators.required
      ]);
      this.addComplaintForm.controls["pattern"].updateValueAndValidity();
      this.tableList = true;
      this.organizationData = "";
      this.addComplaintForm.get("orgAddress").clearValidators();
      this.addComplaintForm.get("orgPinCode").clearValidators();
      this.addComplaintForm.get("orgAddress").updateValueAndValidity();
      this.addComplaintForm.get("orgPinCode").updateValueAndValidity();
    } else if (name == "dwelling place or house" || name == "miscellaneous"  || name == "other") {
      if (name == "miscellaneous"  || name == "other") {
        this.miscellaneous = true;
      }
      this.tableList = false;
      this.addComplaintForm.controls["orgAddress"].setValidators([
        Validators.required
      ]);
      this.addComplaintForm.controls["orgPinCode"].setValidators([
        Validators.required
      ]);
      this.addComplaintForm.get("pattern").clearValidators();
      this.addComplaintForm.get("pattern").updateValueAndValidity();
      this.addComplaintForm.get("orgAddress").updateValueAndValidity();
      this.addComplaintForm.get("orgPinCode").updateValueAndValidity();
      //updateValueAndValidity()
    }
  }
  validateDate(date: Date, index) {
   // if (index) {
     // console.log(date, "date date index" + index);
      const dd = this.addComplaintForm.value.complaint;
      const linesFormArray = this.addComplaintForm.get("complaint").value[
        index
      ] as FormGroup;
      //console.log(linesFormArray, "linesFormArray");
      if (linesFormArray["date"] != "") {
       // console.log(date, "Initial Date");
        const transformDate = this.datePipe.transform(new Date(date));
        const dateDiff =
          new Date().valueOf() - new Date(transformDate).valueOf();
        const diff = Math.floor(dateDiff / (1000 * 3600 * 24));

       // console.log(diff, "Math.floor(dateDiff / (1000 * 3600 * 24))");
        if (diff) {
          const complaintFormArray = this.addComplaintForm.controls
            .complaint as FormArray;
          const complainFormGroup = complaintFormArray.controls[
            index
          ] as FormGroup;
          if (diff > 90) {
            complainFormGroup.controls["lateReason"].setValidators([
              Validators.required
            ]);
            this.showReasonBox[index] = true;
          } else {
            this.showReasonBox[index] = false;
            const lateReasonArray = [];
            lateReasonArray[index] = { lateReason: "" };
            const lateReasonPatch = [];
            lateReasonPatch["complaint"] = lateReasonArray;

            this.addComplaintForm.patchValue(lateReasonPatch);

            linesFormArray["lateReason"] = "YES";
            complainFormGroup.controls["lateReason"].clearValidators();
          }
          complainFormGroup.controls["lateReason"].updateValueAndValidity();
        }
      }
    //}
  }
  getOrganization() {
    // console.log(this.addComplaintForm.value, "this.createComplaintForm");
    // console.log(this.addComplaintForm.value["orgCategory"], "getOrganization");

    //this.organizationService.getOrganization();
    this.showOrgTable = false;
    if (this.addComplaintForm.value["orgCategory"] == "") {
      this.alertService.error("Please select workplace category");
    } else if (this.addComplaintForm.value["pattern"] == "") {
      this.alertService.error('ERROR.PLEASE_SEARCH_WORKPLACE');
    } else {
      this.alertService.clear();
      this.addComplaintForm.patchValue({
        orgunit: "",
        unitDetail: ""
      });
      this.addComplaintForm.get("orgunit").clearValidators();
      this.addComplaintForm.get("orgunit").updateValueAndValidity();
      this.addComplaintForm.get("unitDetail").clearValidators();
      this.addComplaintForm.get("unitDetail").updateValueAndValidity();

      const SelectedCategory = this.addComplaintForm.value["orgCategory"];
      const Pattern = this.addComplaintForm.value["pattern"];
      this.organization = true;

      this.organizationService
        .filterOrganization(SelectedCategory, Pattern)
        .subscribe(
          (data: any) => {
            this.organizationData = data;
            this.showOrgTable = true;
            //Add Required to select Organization
            this.addComplaintForm
              .get("orgunit")
              .setValidators([Validators.required]);
            this.addComplaintForm.get("orgunit").updateValueAndValidity();
            //console.log(data, "data transfer successful");
          },
          error => {
            if (error !== null) {
              console.log(JSON.stringify(error), "ERROR");
            }
          }
        );
    }
  }

  getUnitDetails(unit) {
    //console.log(unit, "Called Get Unit Details Function");
    this.unitDetails = true;
    this.selectedorgData["unit"] = { name: unit.name, code: unit.code };
    // console.log(this.selectedorgData);
    //console.log(unit, "getUnitDetails");
    //organisationCode: "",
    //unitCode: "",
    this.addComplaintForm.patchValue({
      unitCode: unit.code,
      regNumber: this.selectedOrgCode
    });
    this.iccDetails = unit;
    // this.committeeService
    //   .getCommitteByUnit(this.selectedOrgCode, unit.code)
    //   .subscribe(
    //     (data: any) => {
    //       //this.organizationData = data;
    //       console.log(data, "data transfer successful");
    //       this.iccDetails = data;
    //     },
    //     error => {
    //       if (error !== null) {
    //         console.log(JSON.stringify(error), "ERROR");
    //       }
    //     }
    //   );
  }

  ComplainantType(type: string) {
    if (type == "self") {
      // console.log(type, "ComplainantType called self");
      this.other = false;
      this.addComplaintForm.get("reason").clearValidators();

      this.addComplaintForm.get("complainantId").clearValidators();
      this.addComplaintForm.get("consent").clearValidators();
      this.addComplaintForm.get("relationship").clearValidators();
      const complainantForm = this.addComplaintForm.get(
        "complainant"
      ) as FormControl;
      complainantForm.get("name").clearValidators();

      this.addComplaintForm.get("reason").updateValueAndValidity();
      this.addComplaintForm.get("complainantId").updateValueAndValidity();
      this.addComplaintForm.get("consent").updateValueAndValidity();
      this.addComplaintForm.get("relationship").updateValueAndValidity();
      complainantForm.get("name").updateValueAndValidity();

      // console.log(
      //   this.addComplaintForm,
      //   "this.addComplaintForm.get('complainant') from selffffff"
      // );
    }
    if (type == "other") {
     // console.log(type, "ComplainantType called other");
      this.other = true;
      this.addComplaintForm.get("reason").setValidators([Validators.required]);
      this.addComplaintForm
        .get("complainantId")
        .setValidators([Validators.required]);
      this.addComplaintForm.get("consent").setValidators([Validators.required]);
      this.addComplaintForm
        .get("relationship")
        .setValidators([Validators.required]);
      const complainantForm = this.addComplaintForm.get(
        "complainant"
      ) as FormControl;
      complainantForm.get("name").setValidators([Validators.required]);

      this.addComplaintForm.get("reason").updateValueAndValidity();
      this.addComplaintForm.get("complainantId").updateValueAndValidity();
      this.addComplaintForm.get("consent").updateValueAndValidity();
      this.addComplaintForm.get("relationship").updateValueAndValidity();
      complainantForm.get("name").updateValueAndValidity();
      //this.addComplaintForm.get('complainant').setValidators([Validators.required]);
      //console.log(dd,"dddddddddddddd");
      // console.log(
      //   this.addComplaintForm,
      //   "this.addComplaintForm.get('complainant')"
      // );
      //this.addComplaintForm.get('complainant').setValidators([Validators.required]);
    }
  }

  getOTPVerify() {
    console.log("A Test");
  }

  backToStep(stepNumber: number) {
    this.resetForm();
    this.stepNumber = stepNumber;
  }

  resetForm() {
    this.stepOne = false;
    this.steptwo = false;
    this.stepOneSumbitted = false;
    this.stepTwoSumbitted = false;
  }

  validateStep(stepNumber: number) {
    this.stepNumberSubmitted = stepNumber;
    const aa = this.addComplaintForm.controls;
    switch (stepNumber) {
      case 1: {
        if (
          this.f.self.status == "VALID" &&
          this.f.writtenComplaint.status == "VALID" &&
          this.f.governmentId.status == "VALID"
        ) {
          if (this.addComplaintForm.value["self"] == "self") {
            this.stepNumber = stepNumber + 1;
          } else {
            if (
              this.f.complainant.status == "VALID" &&
              this.f.relationship.status == "VALID" &&
              this.f.complainantId.status == "VALID" &&
              this.f.consent.status == "VALID" &&
              this.f.reason.status == "VALID"
            ) {
              this.stepNumber = stepNumber + 1;
            }
          }
        }

        //   console.log(this.addComplaintForm.controls);
        //  this.alertService.clear();
        // if(this.addComplaintForm.valid){
        //   console.log(this.stepNumber,"First STep Clicked");
        //   this.stepNumber = stepNumber+1;
        //   this.addComplaintForm.get('workPlaceCategory').setValidators([Validators.required]);//organisationCode unitCode
        //   this.addComplaintForm.get('organisationCode').setValidators([Validators.required]);
        //   this.addComplaintForm.get('unitCode').setValidators([Validators.required]);
        // }else{
        //   this.alertService.error("Please fill all required field",true);
        // }
        // console.log(this.addComplaintForm, "First STep Clicked !!!!!!!!!!!!!");
        break;
      }

      case 2: {
        if (this.f.orgCategory.status == "VALID") {
          if (
            this.addComplaintForm.value["orgCategory"] == "government" ||
            this.addComplaintForm.value["orgCategory"] == "private" ||
            this.addComplaintForm.value["orgCategory"] == "lessthanten"
          ) {
            if (
              this.f.pattern.status == "VALID" &&
              this.f.orgunit.status == "VALID" &&
              this.addComplaintForm.value['orgunit']!='' &&
              this.f.unitDetail.status == "VALID"
            ) {
              this.stepNumber = stepNumber + 1;
            }
          } else if (
            this.addComplaintForm.value["orgCategory"] ==
              "dwelling place or house" ||
            this.addComplaintForm.value["orgCategory"] == "miscellaneous" ||
            this.addComplaintForm.value["orgCategory"] == "other"
          ) {
            if (
              this.f.orgPinCode.status == "VALID" &&
              this.f.orgAddress.status == "VALID"
            ) {
              this.stepNumber = stepNumber + 1;
            }
          }
        } else {
         // console.log(this.stepNumber, "Step Number");
          this.stepNumber = stepNumber;
        }
        break;
      }

      case 3:
        {
          if (
            this.f.complaint.status == "VALID" &&
            this.f.expectedAction.status == "VALID"
          ) {
            this.stepNumber = stepNumber + 1;
          }
        }
        break;
    }
  }

  get f() {
    return this.addComplaintForm.controls;
  }

  onSelectReason(reason_id: String, value: String) {
    this.selectedReason = reason_id;
    this.relationsships = this.getRelationship().filter(item => {
      return item.reason_id === reason_id;
    });
  }

  getworkPlaceCategory() {
    return [
      {
        id: "government",
        name: "COMMON.GOVERNMENT_ORGANISATION",
        tooltip:
          "Any workplace established, owned, controlled by the National or State Government"
      },
      {
        id: "private",
        name: "COMMON.PRIVATE_ORGANISATION",
        tooltip:
          "Any non government workplace which is run by a person, partnership or corporations"
      },
      {
        id: "dwelling place or house",
        name: "COMMON.DWELLING_PLACE_OR_HOUSE",
        tooltip:
          "Any house, flat, or other place of residence which is not an organization and is not governed by any government or private body"
      },
      {
        id: "other",
        name: "COMMON.MISCELLANEOUS",
        tooltip:
          "Any workplace which is not covered in the above falls under the miscellaneous category"
      }
    ];
  }

  getReasons() {
    return [
      { key: "Physical Incapacity", name: "COMPLAINANT.PHYSICAL_INCAPACITY" },
      { key: "Mental Incapacity", name: "COMPLAINANT.MENTAL_CAPACITY" },
      { key: "Death", name: "COMPLAINANT.DEATH" },
      { key: "Other Reason", name: "COMPLAINANT.OTHER_REASON" }
    ];
  }

  getRelationship() {
    return [
      {
        id: 1,
        reason_id: "Physical Incapacity",
        key: "Relative",
        name: "COMPLAINANT.RELATIVE"
      },
      {
        id: 2,
        reason_id: "Physical Incapacity",
        key: "Friend",
        name: "COMPLAINANT.FRIEND"
      },
      {
        id: 3,
        reason_id: "Physical Incapacity",
        key: "CoWorker",
        name: "COMPLAINANT.COWORKER"
      },
      {
        id: 4,
        reason_id: "Physical Incapacity",
        key: "Officer of NCW or SCW",
        name: "COMPLAINANT.OFFICER_NCW_SCW"
      },
      {
        id: 5,
        reason_id: "Physical Incapacity",
        key: "Other",
        name: "COMPLAINANT.OTHER"
      },
      {
        id: 6,
        reason_id: "Mental Incapacity",
        key: "Relative",
        name: "COMPLAINANT.RELATIVE"
      },
      {
        id: 7,
        reason_id: "Mental Incapacity",
        key: "Friend",
        name: "COMPLAINANT.FRIEND"
      },
      {
        id: 8,
        reason_id: "Mental Incapacity",
        key: "Special Educator",
        name: "COMPLAINANT.SPECIAL_EDUCATOR"
      },
      {
        id: 9,
        reason_id: "Mental Incapacity",
        key: "Psychiatrist",
        name: "COMPLAINANT.PSYCHIATRIST"
      },
      {
        id: 10,
        reason_id: "Mental Incapacity",
        key: "Psychologist",
        name: "COMPLAINANT.PSYCHOLOGIST"
      },
      {
        id: 11,
        reason_id: "Mental Incapacity",
        key: "Guardian",
        name: "COMPLAINANT.GUARDIAN"
      },
      {
        id: 12,
        reason_id: "Mental Incapacity",
        key: "Guardian Authority",
        name: "COMPLAINANT.GUARDIAN_AUTHORITY"
      },
      {
        id: 13,
        reason_id: "Death",
        key: "Relative",
        name: "COMPLAINANT.RELATIVE"
      },
      { id: 14, reason_id: "Death", key: "Friend", name: "COMPLAINANT.FRIEND" },
      {
        id: 15,
        reason_id: "Death",
        key: "CoWorker",
        name: "COMPLAINANT.COWORKER"
      },
      {
        id: 16,
        reason_id: "Death",
        key: "Officer of NCW or SCW",
        name: "COMPLAINANT.OFFICER_NCW_SCW"
      },
      {
        id: 17,
        reason_id: "Death",
        key: "Guardian",
        name: "COMPLAINANT.GUARDIAN"
      },
      { id: 18, reason_id: "Death", key: "Other", name: "COMPLAINANT.OTHER" },
      {
        id: 19,
        reason_id: "Other Reason",
        key: "Relative",
        name: "COMPLAINANT.RELATIVE"
      },
      {
        id: 20,
        reason_id: "Other Reason",
        key: "Friend",
        name: "COMPLAINANT.FRIEND"
      },
      {
        id: 21,
        reason_id: "Other Reason",
        key: "CoWorker",
        name: "COMPLAINANT.COWORKER"
      },
      {
        id: 22,
        reason_id: "Other Reason",
        key: "Officer of NCW or SCW",
        name: "COMPLAINANT.OFFICER_NCW_SCW"
      },
      {
        id: 23,
        reason_id: "Other Reason",
        key: "Guardian",
        name: "COMPLAINANT.GUARDIAN"
      },
      {
        id: 24,
        reason_id: "Other Reason",
        key: "Other",
        name: "COMPLAINANT.OTHER"
      }
    ];
  }
  listPincode(){
    this.organizationService.
    listPincode().subscribe(
      (data: any) => {
        this.pinCode = data;
      },
      error => {
        if (error !== null) {
          console.log("ERROR" + error);
        }
      }
    );
  }
}
