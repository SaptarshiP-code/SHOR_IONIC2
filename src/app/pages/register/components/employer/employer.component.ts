import { Component, OnInit } from "@angular/core";
import { MustMatch } from "./../../../../shared/helpers/must-match.validator";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from "@angular/forms";

import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "./../../../../shared/services/auth/auth.service";
import { Router } from "@angular/router";
import { OrganizationService } from "./../../../../shared/services/organization/organization.service";
import { CommitteeService } from "./../../../../shared/services/committee/committee.service";
import { UnitHeadService } from "./../../../../shared/services/organization/unit-head.service";
import { AlertService } from "./../../../../shared/services/alert/alert.service";
import { OtpService } from "./../../../../shared/services/register/otp.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-employer",
  templateUrl: "./employer.component.html",
  styleUrls: ["./employer.component.scss"]
})
export class EmployerComponent implements OnInit {
  regiterEmployerForm: FormGroup;
  addUnitForm: FormGroup;
  organizationData: any;
  workPlaceCategory: any = [];
  SubCategoryOrganization: any = [];
  organizationDetail: any;
  stepNumber = 1;
  stepOneSumbitted = false;
  isLoading: Boolean = true;
  emailOtp: Number;
  mobileOtp: Number;
  mobileNumber: String;
  savedEmployerData: any;
  validRegNumber: Boolean;
  showOrgTable: Boolean = false;
  enableBack = false;
  showHelpText: boolean = false;
  HideSubCategory:Boolean = true;
 
  showValidationError = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private organizationService: OrganizationService,
    private committeeService: CommitteeService,
    private unitHeadService: UnitHeadService,
    private alertService: AlertService,
    private otpService: OtpService,
    private authService: AuthService
  ) {
    const browserLang = translate.getBrowserLang();
    if (!sessionStorage.getItem("lang")) {
      sessionStorage.setItem("lang", "en");
    }
    const lang = sessionStorage.getItem("lang");
    translate.use(lang);
  }

  ngOnInit() {
    this.regiterEmployerForm = this.formBuilder.group(
      {
        orgCategory: ["",[Validators.required]],
        orgSubCategory : [""],
        pattern:  ["",[Validators.required]],
        name: "",
        regNumber: ["",[Validators.required]],
        orgunit:"",
        mobileNumber: "",
        mobileOtp: "",
        emailId: "",
        emailOtp: "",
        password: [
          "",
          [
            Validators.required,
            Validators.pattern(
              '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[!@#$%^&*]).{8,30}'
            )
          ]
        ],
        cpassword: ["", Validators.required]
      },
      {
        validator: MustMatch("password", "cpassword")
      }
    );
    var object = {
      emailId: "tahirzaib92@gmail.com",
      mobileNumber: "1231231231",
      name: "123",
      organisation: {
        address: "123",
        category: "school",
        name: "123",
        regNumber: "123123123"
      }
    };
    this.getworkPlaceCategory();
    // this.addUnitDetails(object);
  }
  getHelpToggle(){
    this.showHelpText =! this.showHelpText;
  }
  onCloseToggle(){
  this.showHelpText = false;
}
  get regf() {
    return this.regiterEmployerForm.controls;
  }
  backToStep(stepNumber){
    // if(stepNumber == 1){
    //   this.regiterEmployerForm.patchValue({regNumber:''});
    // }
    this.stepNumber = stepNumber;
    
    this.alertService.clear();
  }
  validateRegistration(showValidationError){
    
   // console.log(this.regiterEmployerForm, 'from register');
    const regValue = this.regiterEmployerForm.value['regNumber']
    //console.log(regValue+" :: "+this.organizationDetail.registrationNumber,"this.organizationDetail.registrationNumber");
    if(regValue=='' &&  showValidationError == 0){
      this.validRegNumber = false;
      this.regiterEmployerForm.get('regNumber').setErrors({ required: true });
    }else if(this.organizationDetail.registrationNumber == regValue){
      this.validRegNumber = true;
      this.alertService.clear();
      this.alertService.notification('NOTIFICATION.ORG_ID_VERIFIED');
      
    }else{
      this.showValidationError = showValidationError;
      this.validRegNumber = false;
      this.enableBack = true;
      this.regiterEmployerForm.patchValue({mobileOtp:'',emailOtp:'',password:'',cpassword:''});
    }
  }
  registerEmployer() {
   // console.log("Validate All OTP");
    console.log(this.regiterEmployerForm);
    
    this.stepOneSumbitted = true;
    // this.stepNumber = 3;
    // this.addUnitDetails();
    //(this.organizationDetail," regiterEmployerForm this.organizationDetail" +this.regiterEmployerForm.value['regNumber'] +"=="+this.organizationDetail.registrationNumber);
    if(this.regiterEmployerForm.value['regNumber']!= this.organizationDetail.registrationNumber){
      this.validRegNumber = false;
      this.alertService.error("Please enter your registration Number");
      console.log("not else");

    } else if (this.regiterEmployerForm.valid) {
      console.log("else");
      this.validRegNumber = true;
    //  console.log("Calling Registration Service for the Complainant");
      this.isLoading = true;

      var object = {
        cpassword: this.regiterEmployerForm.value.cpassword,
        emailId: this.regiterEmployerForm.value.emailId,
        mobileNumber: this.regiterEmployerForm.value.mobileNumber,
        mobileOtp: this.regiterEmployerForm.value.mobileOtp,
        name: this.regiterEmployerForm.value.name,
        orgCategory: this.regiterEmployerForm.value.orgCategory,
        orgSubCategory: this.regiterEmployerForm.value.orgSubCategory,
        orgunit: this.regiterEmployerForm.value.orgunit,
        password: this.regiterEmployerForm.value.password,
        pattern: this.regiterEmployerForm.value.pattern,
        regNumber: this.regiterEmployerForm.value.regNumber
      }

      if(this.regiterEmployerForm.value.emailOtp !== ""){
        object["emailOtp"] =  this.regiterEmployerForm.value.emailOtp;
      }

      this.authService
        .employerSignUp(object)
        .pipe(first())
        .subscribe(
          (data: any) => {
            console.log("res of register");
            console.log(data);
            this.isLoading = false;
          //  console.log(data, "Employer Registration Successfully Done");
            if (data && data.success) {
              // console.log(
              //   "Employer Registration Successfully Completed" + data
              // );
              this.alertService.success(
                "To confirm the registration, please click on Submit.",
                true
              );
              this.savedEmployerData = data.data;
              this.stepNumber = 3;
              this.addUnitDetails(this.savedEmployerData);
              //this.router.navigate([`/login`]);
            }
          },
          error => {
            if (error !== null) {
              this.isLoading = false;

              console.log(error.error, "Errors");

              this.alertService.error(error);
            }
          }
        );
    }
    // else{
    //   this.alertService.error("Please fill all required field");
    // }
  }
  saveUnitDetails() {
    console.log(this.addUnitForm);
     if (this.addUnitForm.valid) {
      var  object : any = {
        name : this.addUnitForm.value.name,
        emailId : this.addUnitForm.value.emailId,
        mobileNumber : this.addUnitForm.value.mobileNumber,
        organisation : this.addUnitForm.value.organisation,
        regNumber : this.addUnitForm.value.regNumber,
        isEmployer : true,
        unit:[]
      }

      for(var i =0 ; i< this.addUnitForm.value.unit.length ; i++){
        object.unit.push({ name : this.addUnitForm.value.unit[i].name , address : {
          area : this.addUnitForm.value.unit[i].address,
          district : this.addUnitForm.value.unit[i].district,
          state : this.addUnitForm.value.unit[i].state,
          pin : this.addUnitForm.value.unit[i].pin,
        } })
      }

      var sendObject = {
        organisation : this.addUnitForm.value.organisation,
        regNumber : this.addUnitForm.value.regNumber,
        isEmployer : true,
        unit: object.unit[0]
      }


      console.log(object);
      console.log(sendObject);

      this.unitHeadService
        .addUnit(sendObject)
        .pipe(first())
        .subscribe(
          (data: any) => {
            console.log(data);
           // console.log(data, "data transfer succesful");
            if (data && data.success) {
            //  console.log(data, "Saved Successfully");
              this.alertService.success("Registration Completed Successfully", true);
                this.router.navigate([`/login/employer`]);
            }
          },
          error => {
            this.alertService.error("Some thing went wrong!");
            if (error !== null) {
             // console.log(error, "Error");
            }
          }
        );
    }else{
      return;
    }
     
  }
  addUnitDataForm(data) {
    return this.formBuilder.group({
      name: ["" , [Validators.required]],
      address: ["" , [Validators.required]] ,
      pin: ["" , [Validators.required]],
      area:["NONE" , [Validators.required]],
      district:["" , [Validators.required]],
      state:["" , [Validators.required]],
    });
  }
  
  addUnitMore(){
    this.UnitFormArray.push(this.formBuilder.group({
      name: ["" , [Validators.required]],
      address: ["" , [Validators.required]] ,
      pin: ["" , [Validators.required]],
      area:["NONE" , [Validators.required]],
      district:["" , [Validators.required]],
      state:["" , [Validators.required]],
    }));

  }

  get UnitFormArray() {
    return this.addUnitForm.get('unit') as FormArray;
  }

  get unitform (){
    return this.addUnitForm.controls;
  }

  unitFormSubmitted : boolean = false;
  
  
  addUnitDetails(data) {
    this.addUnitForm = this.formBuilder.group({
      name: data.name,
      mobileNumber: data.mobileNumber,
      emailId: data.emailId,
      organisation: data.organisation.name,
      regNumber: data.organisation.regNumber,
      unit: this.formBuilder.array([this.addUnitDataForm(data)])
    });
  }
  

  subcatIndex;
  changeCategory(cat){
    console.log(cat);
    this.SubCategoryOrganization = [];
    this.regiterEmployerForm.patchValue({
      orgunit: "",pattern: ""});
      this.organizationData = "";
    this.regiterEmployerForm.get("orgunit").clearValidators();
    this.regiterEmployerForm.get("orgunit").updateValueAndValidity();
    this.regiterEmployerForm.get("pattern").updateValueAndValidity();
    this.organizationService.getOrganizationSubCategories(cat).subscribe(subCat => {
      if(subCat.length > 0){
        this.HideSubCategory = false;
        for(this.subcatIndex in subCat){
          this.SubCategoryOrganization.push({ id : subCat[this.subcatIndex] , name : subCat[this.subcatIndex] });
        }
        console.log(this.SubCategoryOrganization);
        return;
      }else if(subCat.length <= 0){
        this.HideSubCategory = true;
        return;
      }else{
        return;
      }
    } , error => {
      if (error !== null) {
        this.HideSubCategory = true;
        this.isLoading = false;
        console.log(error.error, "Errors");
        this.alertService.error(error);
      }
    })
  }
  getOrganization() {
    //console.log(this.regiterEmployerForm.value, "this.createComplaintForm");
    // console.log(
    //   this.regiterEmployerForm.value["orgCategory"],
    //   "getOrganization"
    // );
    this.showOrgTable = false;
    this.alertService.clear();
    this.regiterEmployerForm.patchValue({
      orgunit: ""});
      this.organizationData = "";
    this.regiterEmployerForm.get("orgunit").clearValidators();
    this.regiterEmployerForm.get("orgunit").updateValueAndValidity();
    const SelectedCategory = this.regiterEmployerForm.value["orgCategory"];
    const SelectedSubCategory = this.regiterEmployerForm.value["orgSubCategory"];
    const Pattern = this.regiterEmployerForm.value["pattern"];

    //this.organization = true;
    //this.organizationService.getOrganization();
    console.log(Pattern);
    console.log(SelectedCategory);
    console.log(this.regiterEmployerForm);

    if(this.regiterEmployerForm.value["pattern"] == ""){
      this.alertService.error("Please Search Your Organisation");
    }else{
    this.organizationService
      .filterOrganization(SelectedCategory, Pattern )
      .subscribe(
        (data: any) => {
         // this.organizationData = data;
         this.organizationData =  data.filter(function(orgData) {
            return (orgData.status == false && orgData.totalEmp>=10);
          });
          this.showOrgTable = true;
          
          if(data[0] && data[0]['_id']){
            this.regiterEmployerForm.get("orgunit").setValidators([Validators.required]);
            this.regiterEmployerForm.get("orgunit").updateValueAndValidity();
          }
        },
        error => {
          if (error !== null) {
            console.log(JSON.stringify(error), "ERROR");
          }
        }
      );
    }
  }
  x;
  getworkPlaceCategory() {
    // this.workPlaceCategory.push({ id: "government", name: "Government Organisation" },{ id: "private", name: "Private Organisation" });
    this.organizationService.getOrganizationCategories().subscribe(cat => {
      console.log(cat);
      if(cat.length > 0 ){
        for (this.x in cat) {
          this.workPlaceCategory.push({ id: cat[this.x], name: cat[this.x] });  
        }
      }else{
        return;
        // this.workPlaceCategory.push({ id: "No Data Found", name: "No Data Found" });  
      }
    }, error => {
      if (error !== null) {
        this.isLoading = false;
        console.log(error.error, "Errors");
        this.alertService.error(error);
      }
    })
   
  }

  getOTP() {
    if (this.regiterEmployerForm.value["mobileNumber"] != "") {
      this.mobileNumber = this.regiterEmployerForm.value["mobileNumber"];
      this.otpService
        .mobileVerification({
          mobileNumber: this.regiterEmployerForm.value["mobileNumber"],
          user: { category: "employer" }
        })

        .subscribe(
          (data: any) => {
            this.isLoading = false;
         //   console.log(data, "data transfer succesful");
            if (data && data.success) {
              this.alertService.notification('NOTIFICATION.MOBILE_OTP_SENT');
              // console.log(data.data['mobileOtp']+'data transfer succesful' );
              //this.registerForm.setValue({'mobileOtp':"7919429516"});
              //this.setOtp(data.data['mobileOtp']);
              if(data.data["mobileOtp"])
              this.mobileOtp = data.data["mobileOtp"];
              // this.emailId = data.data["emailId"];
              // this.registerForm.controls['emailId'].setValue(data.data['emailId']);
              //  this.registerForm.controls['name'].setValue(data.data['name']);
            }
            // if (data.error != "") {
            //   this.notfication = data.error;
            // }
          },
          error => {
        //    console.log(error, "ERROR sssssssssssssssssss");
            if (error !== null) {
              this.isLoading = false;
              //console.log(error, "ERROR");
              this.alertService.error(error);
            }
          }
        );
    } else {
     // console.log("Mobile Number is not added for OTP");
      this.alertService.error("Please fill mobile number", true);
    }
  }

  getOrgDetails(organization: any) {
   this.alertService.clear();
    this.organizationDetail = organization;
    this.regiterEmployerForm.patchValue({
      name: this.organizationDetail.employerName,
      //regNumber: this.organizationDetail.registrationNumber,
      regNumber: "",
      mobileNumber: this.organizationDetail.mobileNumber,
      emailId: this.organizationDetail.emailId
    });

    if (this.organizationDetail.mobileNumber) {
      this.regiterEmployerForm.controls["mobileOtp"].setValidators([
        Validators.required
      ]);
    }
    // if (this.organizationDetail.emailId) {
    //   this.regiterEmployerForm.controls["emailOtp"].setValidators([
    //     Validators.required
    //   ]);
    // }
  }

  goToStep(stepNumber: number) {
    if (stepNumber==2){
    if(this.regiterEmployerForm.value["orgunit"] != "") {
    this.stepNumber = stepNumber;
    this.validateRegistration(0);
    }else{
      this.alertService.error("Please select organization",true);
    }
  }else{
    this.stepNumber = stepNumber;
    this.alertService.clear();
  }
  }

  getEmailOTP() {
    if (this.regiterEmployerForm.value["emailId"] != "") {
      this.otpService
        .emailVerification({
          emailId: this.regiterEmployerForm.value["emailId"]
        })
        .pipe(first())
        .subscribe(
          (data: any) => {
            this.isLoading = false;
           // console.log(data, "data transfer succesful");
            if (data && data.success) {
             // console.log(data.data["mobileOtp"] + "data transfer succesful");
              //this.registerForm.setValue({'mobileOtp':"7919429516"});
              //this.setOtp(data.data['mobileOtp']);
              if(data.data["emailOtp"]){
                this.emailOtp = data.data["emailOtp"];
              }
              
              this.alertService.notification('NOTIFICATION.EMAIL_OTP_SENT');
            }
          },
          error => {
            if (error !== null) {
              this.isLoading = false;
              console.log("ERROR" + error);
            }
          }
        );
    } else {
      console.log("Email ID can't be blank");
    }
  }


}
