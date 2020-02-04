import { Component, OnInit , ElementRef, ViewChild} from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ComplaintsService } from "./../../../../shared/services/complaints/complaints.service";
import { AuthService  } from "./../../../../shared/services/auth/auth.service";
import { OrganizationService } from "./../../../../shared/services/organization/organization.service";
import { UnitHeadService } from "./../../../../shared/services/organization/unit-head.service";
import { AlertService } from "./../../../../shared/services/alert/alert.service";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transfer-complaint',
  templateUrl: './transfer-complaint.component.html',
  styleUrls: ['./transfer-complaint.component.scss']
})
export class TransferComplaintComponent implements OnInit {


  complaintId : String;
  userId: String;
  userCategory: String;
  complaintDetails: any;
  loadData: Boolean;
  changeOrg: Boolean = false;
  transferError = false;

  transferComplaintForm: FormGroup;
  workPlaceCategory: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private organizationService: OrganizationService,
    private unitHeadService: UnitHeadService,
    public translate: TranslateService,
    private complaintsService: ComplaintsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService
  ) { 
    const browserLang = translate.getBrowserLang();
    if(!sessionStorage.getItem("lang")){
      sessionStorage.setItem('lang',browserLang);
    }
    const lang = sessionStorage.getItem("lang");
 
    translate.use(lang);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.complaintId = params.get("id");
    });
    
    const allowedUserRoles = ['lcc'];
    const accessData = this.authService.validateAccess(allowedUserRoles);
   
    if(accessData && accessData['userCategory'] && accessData['userCategory'] == 'lcc' ){
      this.userId = accessData['userId'];
      this.userCategory = accessData['userCategory'];
      this.getComplainDetail(this.complaintId);
      this.workPlaceCategory = this.getworkPlaceCategory();
      
    }else{
    //  console.log(accessData);
      this.authService.unauthorizedRedirect();
    }

  }
  closeResult:String;
  open(content) {
    this.transferSubmitted = true;
    if(this.transferComplaintForm.valid){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  confirmationClose(){
    this.modalService.dismissAll();
    this.router.navigate([`/complaints/`]);
  }
  transferSubmitted:Boolean;
  transferSuccess:Boolean = false;
  transferComplaint(){
    this.transferSubmitted = true;
    if(this.transferComplaintForm.valid){
      
    this.complaintsService
        .transferComplaint(this.complaintId, this.userId,this.transferComplaintForm.value)
        .subscribe(
          (data: any) => {
            //console.log(data, "data transfer successful");
            if (data && data.success) {
             // console.log(data, "Saved Successfully");
              this.alertService.success(
                "Complaint Transfered successfully",
                true
              );
              this.transferSuccess = true;
              //this.modalService.dismissAll();
              //this.router.navigate([`/complaints/`]);
            }
          },
          error => {
            this.transferError = true;
            if (error !== null) {
              this.alertService.error(error, true);
              console.log(error.error, "Error");
            }
          }
        );
    }
  }
  changeCategory(){
    // this.regiterEmployerForm.patchValue({
    //   orgunit: "",pattern: ""});
    //   this.organizationData = "";
    // this.regiterEmployerForm.get("orgunit").clearValidators();
    // this.regiterEmployerForm.get("orgunit").updateValueAndValidity();
    // this.regiterEmployerForm.get("pattern").updateValueAndValidity();
  }
  unitData:any
  selectedOrgCode: String;
  iccDetails:any;
  unit: Boolean;
  unitDetails: Boolean;
  selectedorgData: any
  getUnits(selectedOrg: any) {
  


    //console.log("Called Get Unit Function");
    this.selectedOrgCode = selectedOrg.registrationNumber;
    this.unitData = "";
    this.iccDetails = "";
    this.unit = false;
    this.unitDetails = false;
    // this.selectedorgData["org"] = {
    //   name: selectedOrg.orgName,
    //   code: selectedOrg.registrationNumber
    // };


    this.transferComplaintForm.patchValue({
      unitCode: "",
      regNumber: selectedOrg.registrationNumber
    });

    this.unitHeadService.getUnit(this.selectedOrgCode).subscribe(
      (data: any) => {

        if (data["0"]) {
          this.unitData = data["0"].unit;

          this.unit = true;
        }

      },
      error => {
        if (error !== null) {
          console.log(JSON.stringify(error), "ERROR");
        }
      }
    );

  }

  getUnitDetails(unit) {
    //console.log(unit,"Unit");
    this.unitDetails = true;
   this.transferComplaintForm.patchValue({
      unitCode: unit.code,
      regNumber: this.selectedOrgCode
    });
    this.iccDetails = unit;
    
  }

  showOrgTable:Boolean;
  organizationData : any;
  getOrganization() {
    this.unitData = '';
    this.unit = false;
    this.unitDetails = false;
    this.iccDetails = '';
    this.showOrgTable = false;
    this.alertService.clear();
    this.transferComplaintForm.patchValue({
      orgunit: ""});
      this.organizationData = "";
    // this.transferComplaintForm.get("orgunit").clearValidators();
    // this.transferComplaintForm.get("orgunit").updateValueAndValidity();
    const SelectedCategory = this.transferComplaintForm.value["orgCategory"];
    const Pattern = this.transferComplaintForm.value["pattern"];
    //this.organization = true;
    //this.organizationService.getOrganization();
    if(this.transferComplaintForm.value["pattern"] == ""){
      this.alertService.error("Please Search Your Organisation");
    }else{
    this.organizationService
      .registeredOrganization(SelectedCategory, Pattern)
      .subscribe(
        (data: any) => {
          //console.log(data);
         // this.organizationData = data;
         this.organizationData =  data;
          this.showOrgTable = true;
        },
        error => {
          if (error !== null) {
            console.log(JSON.stringify(error), "ERROR");
          }
        }
      );
    }
  }
  toggleForm(changeOrg){
    if(changeOrg == 0){
      this.changeOrg = !this.changeOrg;
    }else{
      this.changeOrg = changeOrg;
    }
    
    if(this.changeOrg == true){
      this.transferComplaintForm.controls["orgunit"].setValidators([
        Validators.required
      ]);
     
      this.transferComplaintForm.controls["orgCategory"].setValidators([
        Validators.required
      ]);
      this.transferComplaintForm.controls["pattern"].setValidators([
        Validators.required
      ]);
           
            this.transferComplaintForm.controls["unitCode"].setValidators([
        Validators.required
      ]);
      this.transferComplaintForm.controls["unitDetail"].setValidators([
        Validators.required
      ]);
      this.transferComplaintForm.controls["orgunit"].updateValueAndValidity();
      
      this.transferComplaintForm.controls["orgCategory"].updateValueAndValidity();
      this.transferComplaintForm.controls["pattern"].updateValueAndValidity();
      this.transferComplaintForm.controls["unitCode"].updateValueAndValidity();
      this.transferComplaintForm.controls["unitDetail"].updateValueAndValidity();

    }else{

      this.transferComplaintForm.controls["orgunit"].clearValidators();
      this.transferComplaintForm.controls["orgCategory"].clearValidators();
      this.transferComplaintForm.controls["pattern"].clearValidators();
      this.transferComplaintForm.controls["unitCode"].clearValidators();
      this.transferComplaintForm.controls["unitDetail"].clearValidators();

      this.transferComplaintForm.controls["orgunit"].updateValueAndValidity();
      this.transferComplaintForm.controls["orgCategory"].updateValueAndValidity();
      this.transferComplaintForm.controls["pattern"].updateValueAndValidity();
      this.transferComplaintForm.controls["unitCode"].updateValueAndValidity();
      this.transferComplaintForm.controls["unitDetail"].updateValueAndValidity();
    }
  }

  resetData(){
          this.organizationData =  '';
          this.showOrgTable = false;
          this.unitData = '';
          this.unit = false;
          this.unitDetails = false;
          this.iccDetails = '';

    this.transferComplaintForm.patchValue({
      regNumber: "",
            orgunit:"",
            reason: "",
            orgCategory:"",
            pattern:"",
            unitCode:"",
            unitDetail:""
    });
    this.toggleForm(true);
  }
  getComplainDetail(complaintId: String) {
    this.complaintsService.complaintDetail(complaintId).subscribe(
      (data: any) => {
        //console.log(data, "data");
        this.complaintDetails = data;
        this.loadData = true;
        if(data.workPlace && data.workPlace.organisation && data.workPlace.organisation.unit && data.workPlace.organisation.unit.iccStatus == true){
          this.changeOrg = false;
          this.transferComplaintForm =  this.formBuilder.group({
            regNumber: "",
            orgunit:"",
            reason: ["", [Validators.required]],
            orgCategory:"",
            pattern:"",
            unitCode:"",
            unitDetail:""
          });
        }else{
          this.changeOrg = true;
          this.transferComplaintForm =  this.formBuilder.group({
            regNumber: ["", [Validators.required]],
            unitDetail:["", [Validators.required]],
            orgunit:["", [Validators.required]],
            reason:["", [Validators.required]],
            orgCategory:["", [Validators.required]],
            pattern:["", [Validators.required]],
            unitCode:["", [Validators.required]]
          });
        }
        

        // console.log(data, "data transfer successful");
       // return data;
      },
      error => {
        if (error !== null) {
         // console.log(JSON.stringify(error), "ERROR");
         this.alertService.error("Please select a valid complaint");
        }
      }
    );
  }
  getTranslationKey(value){
    
    const aa = this.getworkPlaceCategory().filter(item => {
     // console.log(item,"Filter Items")
      return item.id == value;
    });
    //console.log(aa,"getTranslationKey returned");
    if(aa && aa[0] && aa[0].name){
      return aa[0].name;
    }else{
      return false;
    }
    
  }
  get f() {
    return this.transferComplaintForm.controls;
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
      }
    ];
  }


}
