import { Component, OnInit , ElementRef, ViewChild} from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ComplaintsService } from "./../../../../shared/services/complaints/complaints.service";
import { AlertService } from "./../../../../shared/services/alert/alert.service";
import {environment} from 'src/environments/environment'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-detail-complaint",
  templateUrl: "./detail-complaint.component.html",
  styleUrls: ["./detail-complaint.component.scss"]
})

export class DetailComplaintComponent implements OnInit {
  complaintDetails: any;
  complaintData: any;
  respondentData: any;
  name: string;
  mobileNumber: String;
  emailId: String;
  complaintId: String;
  loadData: Boolean = false;
  disposeForm: FormGroup;
  transferForm: FormGroup;
  transferSubmitted = false;
  addCommentForm: FormGroup;
  dispose: Boolean = false;
  userCategory: String;
  otherType: Boolean;
  userId: String;
  addCommentData = false;
  GovefileUrl:any;
  relUrl = environment.API;
  closeResult: string;
  transferSuccess = false;
  disposalDetails : any;
  showTransfer=false;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    public translate: TranslateService,
    private complaintsService: ComplaintsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertService


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

    const userToken = JSON.parse(sessionStorage.getItem("userToken"));
    if (!sessionStorage.getItem("userToken")) {
      this.router.navigate([`/`]);
    } else if (
      userToken["user"]["category"] != "complainant" &&
      userToken["user"]["category"] != "icc" &&
      userToken["user"]["category"] != "lcc" &&
      userToken["user"]["category"] != "do" &&
      userToken["user"]["category"] != "dpo" &&
      userToken["user"]["category"] != "employer"
    ) {
      this.router.navigate([`/login/other`]);
    } else {
      ///this.getComplainDetail(this.complaintId);
      //console.log("Complainant Type User");
      // this.name = userToken.name;
      this.emailId = userToken.emailId;
      this.userCategory = userToken["user"]["category"];
      this.mobileNumber = userToken.mobileNumber;
      this.userId = userToken._id;

      this.getComplainDetail(this.complaintId);
      //this.complaintDetails = JSON.parse(localStorage.getItem('selectedComplain'));
    }
  }
  open(content) {
    this.transferForm = this.formBuilder.group({
     reason:["", [Validators.required]]
    });
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
  toggle() {
    this.showTransfer = !this.showTransfer;
  }
  confirmationClose(){
    this.modalService.dismissAll();
    this.router.navigate([`/complaints/`]);
  }
  transferComplaint(){
    this.transferSubmitted = true;
    if(this.transferForm.valid){
      
    this.complaintsService
        .transferComplaint(this.complaintId, this.userId,this.transferForm.value)
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
            if (error !== null) {
              this.alertService.error(error, true);
              console.log(error.error, "Error");
            }
          }
        );
    }
  }

  backToStep(stepNumber){
    if(stepNumber == 1){
      this.dispose = false;
      this.loadData = true;
      this.addCommentData = false;
    }
    if(stepNumber == 2){
      this.dispose = true;
      this.loadData = false;
      this.addCommentData = false;
    }
  }
  downloadFile(url1,name){
    const url = url1+'/'+name;
    const nameArray = name.split(".");
    //const extension  = nameArray[1];
    const fileName = nameArray[0].split("/");

    const nameFull = name.split("/");
    //console.log(url,"URL");
    //console.log(nameArray,"nameArray");
    //console.log(fileName,"fileName");
    this.complaintsService.getImage(url).subscribe(
      (data: any) => {
        //console.log(data, "data");
        let dataType = data.type;
        let binaryData = [];
        binaryData.push(data);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        //console.log(nameArray[1]+"sssssssssssssss"+nameArray[0]);

        //downloadLink.setAttribute('download', nameArray[1]);//nameFull[1]
        downloadLink.setAttribute('download',nameFull[1]);

        // if ("pdf")
        // downloadLink.setAttribute('download', "pdf");

        //downloadLink.setAttribute('target','_blank');
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      error => {
        if (error !== null) {
          console.log(error, "ERROR");
        }
      }
    );
  }
  //public async downloadZip(): Promise<void> 
   loadImage(name:string){
    if(name){
      //console.log(name,"ddddddddd");
  
      this.complaintsService.getAttachment(this.complaintId,name).subscribe(
        (data: any) => {
             let dataType = data.type;
            let binaryData = [];
            binaryData.push(data);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            if ("png")
            downloadLink.setAttribute('download', "png");

            if ("pdf")
            downloadLink.setAttribute('download', "pdf");
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
          // console.log(data, "data");
          // let blob = new Blob([data], { type: 'application/png'});
          // console.log(blob);
          // let url = window.URL.createObjectURL(blob);
          // let pwa = window.open(url);
          // if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          //     alert( 'Please disable your Pop-up blocker and try again.');
          // }
          // //  this.GovefileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(data));
          // console.log(this.GovefileUrl, "data transfer successful");
          return data;
        },
        error => {
          if (error !== null) {
            console.log(JSON.stringify(error), "ERROR");
          }
        }
      );
    }else{
      this.alertService.error("Error with image download");
    }
  }

  getComplainDetail(complaintId: String) {
    this.complaintsService.complaintDetail(complaintId).subscribe(
      (data: any) => {
        //console.log(data, "data");
        this.complaintDetails = data;
        this.complaintData = data.complaint;
        this.respondentData = data.respondent;
        this.loadData = true;

        // console.log(data, "data transfer successful");
       // return data;
      },
      error => {
        if (error !== null) {
          console.log(JSON.stringify(error), "ERROR");
        }
      }
    );
  }

  disposeData(userCategory) {
    this.loadData = false;
    this.dispose = true;
   // console.log(userCategory);
    if (
      (userCategory == "icc" || userCategory == "lcc") &&
      this.complaintDetails.status == "In-Progress"
    ) {

      this.dispose = true;
      this.disposeForm = this.formBuilder.group({
        summary: ["", [Validators.required]],
        recommendation: [""],
        type: ["", [Validators.required]],
        other: ""
      });
    } else {

      //if(this.complaintDetails.status ==='disposed'|| userCategory == "complainant"){
        let disposalData:any;
        if(userCategory == "complainant" || userCategory == 'do' || userCategory == 'dpo' || userCategory == 'employer' ){
           disposalData = this.complaintDetails['lcc'] ?this.complaintDetails['lcc'] : this.complaintDetails['icc'];
        }else{
           disposalData = this.complaintDetails[userCategory];
         }
         if(this.complaintDetails['disposal']){
          disposalData  = this.complaintDetails['disposal'];
         }
         if(disposalData.type == 'other' || disposalData.type == 'Any Other'){
          this.otherType = true;
         }
        console.log(disposalData, "disposalData.type");
        console.log(disposalData.type, "disposalData.type");
        this.disposalDetails = disposalData;
      this.disposeForm = this.formBuilder.group({
        summary: [disposalData.summary],
        recommendation: [disposalData.recommendation],
        type: [disposalData.type.toLowerCase(), [Validators.required]],
        other: [disposalData.other]
      });
      this.disposeForm.disable();
    }
  }

  addComment(userCategory){
    this.addCommentData = true;
    this.dispose = false;
    if(this.complaintDetails.doSubmitted == true){
      this.addCommentForm = this.formBuilder.group({
        nature: [this.complaintDetails.do.nature],
        action: [this.complaintDetails.do.action]
      });
      this.addCommentForm.disable();
    }else if( this.complaintDetails.employerSubmitted == true){
      this.addCommentForm = this.formBuilder.group({
        nature: [this.complaintDetails.employer.nature],
        action: [this.complaintDetails.employer.action]
      });
      this.addCommentForm.disable();
    }else if(userCategory=='do' || userCategory == 'employer'){
      this.addCommentForm = this.formBuilder.group({
        nature: ["", [Validators.required]],
        action: ""
      });
    }else{
      this.alertService.error("Action pending on "+this.complaintDetails.complaintViewer.toUpperCase( )+" side",true);
      this.addCommentData = false;
    this.dispose = true;
    }
    

  }
  validateType() {
    if (this.disposeForm.value["type"] == "other") {
      this.otherType = true;
      this.disposeForm.get("other").setValidators([Validators.required]);
      this.disposeForm.get("other").updateValueAndValidity();
    }else{
      this.otherType = false;
      this.disposeForm.get("other").clearValidators();
      this.disposeForm.get("other").updateValueAndValidity();
    }
  }

  disposeComplaint() {
    if (this.disposeForm.valid) {
      //disposeComplaint
      this.complaintsService
        .disposeComplaint(this.disposeForm.value, this.complaintId, this.userId)
        .subscribe(
          (data: any) => {
            //console.log(data, "data transfer successful");
            if (data && data.success) {
             // console.log(data, "Saved Successfully");
              this.alertService.success(
                "Complaint disposed successfully",
                true
              );
              this.router.navigate([`/complaints/`]);
            }
          },
          error => {
            if (error !== null) {
              this.alertService.error(error, true);
              console.log(error.error, "Error");
            }
          }
        );
    } else {
      this.alertService.error("Please fill all required fields", true);
    }
  }

  postCommentData() {
    if (this.addCommentForm.valid) {
      //disposeComplaint
      this.complaintsService
        .actionComplaint(this.addCommentForm.value, this.complaintId, this.userId)
        .subscribe(
          (data: any) => {
            //console.log(data, "data transfer successful");
            if (data && data.success) {
           //   console.log(data, "Saved Successfully");
              this.alertService.success(
                "Complaint disposed successfully",
                true
              );
              this.router.navigate([`/complaints/`]);
            }
          },
          error => {
            if (error !== null) {
              this.alertService.error(error, true);
              console.log(error.error, "Error");
            }
          }
        );
    } else {
      this.alertService.error("Please fill all required fields", true);
    }
  }

  getTranslationKey(value){
    
    const aa = this.getworkPlaceCategory().filter(item => {
      return item.id == value.toLowerCase();
    });
    if(aa && aa[0] && aa[0].name){
      return aa[0].name;
    }else{
      return false;
    }
    
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
      },
      {
        id: "others",
        name: "COMMON.MISCELLANEOUS",
        tooltip:
          "Any workplace which is not covered in the above falls under the miscellaneous category"
      }
    ];
  }
}
